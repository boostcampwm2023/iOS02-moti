//
//  GroupHomeViewController.swift
//  
//
//  Created by 유정주 on 11/30/23.
//

import UIKit
import Design
import Core
import Combine
import Domain

final class GroupHomeViewController: BaseViewController<HomeView>, LoadingIndicator {
    
    // MARK: - Properties
    weak var coordinator: GroupHomeCoordinator?
    private let viewModel: GroupHomeViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    // MARK: - Init
    init(viewModel: GroupHomeViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNavigationBar(with: viewModel.group)
        addTargets()
        bind()
        
        setupAchievementDataSource()
        setupCategoryDataSource()
        
        viewModel.action(.launch)
    }
    
    // MARK: - Actions
    private func addTargets() {
        layoutView.categoryAddButton.addTarget(self, action: #selector(showAddGroupCategoryAlert), for: .touchUpInside)
        if let tabBarController = navigationController?.tabBarController as? TabBarViewController {
            tabBarController.captureButton.addTarget(self, action: #selector(captureButtonDidClicked), for: .touchUpInside)
        }
    }
    
    @objc private func captureButtonDidClicked() {
        coordinator?.moveToCaptureViewController(group: viewModel.group)
        if let tabBarController = tabBarController as? TabBarViewController {
            tabBarController.hideTabBar()
        }
    }
    
    @objc private func showAddGroupCategoryAlert() {
        let textFieldAlertVC = AlertFactory.makeTextFieldAlert(
            title: "추가할 카테고리 이름을 입력하세요.",
            okTitle: "생성",
            placeholder: "카테고리 이름은 최대 10글자입니다.",
            okAction: { [weak self] text in
                guard let self, let text else { return }
                Logger.debug("그룹 카테고리 생성 입력: \(text)")
                viewModel.action(.addCategory(name: text))
            })
        
        if let textField = textFieldAlertVC.textFields?.first {
            textField.delegate = self
        }
        
        present(textFieldAlertVC, animated: true)
    }
    
    // MARK: - Setup
    private func setupAchievementDataSource() {
        layoutView.achievementCollectionView.delegate = self
        let dataSource = HomeViewModel.AchievementDataSource.DataSource(
            collectionView: layoutView.achievementCollectionView,
            cellProvider: { collectionView, indexPath, item in
                let cell: AchievementCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                
                if item.id < 0 {
                    cell.showSkeleton()
                } else {
                    cell.hideSkeleton()
                    cell.configure(imageURL: item.imageURL)
                }
                
                return cell
            }
        )
        
        dataSource.supplementaryViewProvider = { collecionView, elementKind, indexPath in
            guard elementKind == UICollectionView.elementKindSectionHeader else { return nil }
            
            let headerView = collecionView.dequeueReusableSupplementaryView(
                ofKind: elementKind,
                withReuseIdentifier: HeaderView.identifier,
                for: indexPath) as? HeaderView
            
            return headerView
        }
        
        let diffableDataSource = HomeViewModel.AchievementDataSource(dataSource: dataSource)
        viewModel.setupAchievementDataSource(diffableDataSource)
    }
    
    private func setupCategoryDataSource() {
        layoutView.categoryCollectionView.delegate = self
        let dataSource = HomeViewModel.CategoryDataSource.DataSource(
            collectionView: layoutView.categoryCollectionView,
            cellProvider: { collectionView, indexPath, item in
                let cell: CategoryCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                cell.configure(with: item)
                return cell
            }
        )
        
        let diffableDataSource = HomeViewModel.CategoryDataSource(dataSource: dataSource)
        viewModel.setupCategoryDataSource(diffableDataSource)
    }
    
    // MARK: - Methods
    func deleteAchievementDataSourceItem(achievementId: Int) {
        viewModel.action(.deleteAchievementDataSourceItem(achievementId: achievementId))
    }
    
    func updateAchievement(updatedAchievement: Achievement) {
        viewModel.action(.updateAchievement(updatedAchievement: updatedAchievement))
    }
    
    func postedAchievement(newAchievement: Achievement) {
        viewModel.action(.postAchievement(newAchievement: newAchievement))
        // 화면이 전환되고 즉시 표시하면 애니메이션이 부자연스러움
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.showCelebrate(with: newAchievement)
        }
    }
    
    func blockedAchievement(_ achievementId: Int) {
        viewModel.action(.deleteAchievementDataSourceItem(achievementId: achievementId))
    }
    
    func blockedUser(_ userCode: String) {
        viewModel.action(.deleteUserDataSourceItem(userCode: userCode))
    }
    
    private func showCelebrate(with achievement: Achievement) {
        let celebrateVC = CelebrateViewController(achievement: achievement)
        celebrateVC.modalPresentationStyle = .overFullScreen
        present(celebrateVC, animated: true)
    }
}

// MARK: - Setup NavigationBar
private extension GroupHomeViewController {
    func setupNavigationBar(with group: Group) {
        navigationItem.title = group.name
        
        // 오른쪽 프로필 버튼
        let avatarItemSize: CGFloat = 34
        let avatarImageView = UIImageView()
        avatarImageView.contentMode = .scaleAspectFit
        avatarImageView.clipsToBounds = true
        avatarImageView.layer.cornerRadius = avatarItemSize / 2
        if let groupProfileImageURL = group.avatarUrl {
            avatarImageView.jf.setImage(with: groupProfileImageURL)
        } else {
            avatarImageView.backgroundColor = .primaryGray
        }
        let avatarImageTapGesture = UITapGestureRecognizer(target: self, action: #selector(avatarImageTapAction))
        avatarImageView.isUserInteractionEnabled = true
        avatarImageView.addGestureRecognizer(avatarImageTapGesture)
        
        let profileItem = UIBarButtonItem(customView: avatarImageView)
        profileItem.customView?.atl
            .size(width: avatarItemSize, height: avatarItemSize)
        
        // 오른쪽 더보기 버튼
        let moreItem = UIBarButtonItem(
            image: SymbolImage.ellipsisCircle,
            style: .done,
            target: self,
            action: nil
        )
        let inviteInfoAction = UIAction(title: "그룹원 초대", handler: { _ in
            self.inviteMember()
        })
        let appInfoAction = UIAction(title: "앱 정보", handler: { _ in
            self.moveToAppInfoViewController()
        })
        let logoutAction = UIAction(title: "로그아웃", handler: { _ in
            self.logout()
        })
        
        var children: [UIAction] = []
        if group.grade == .leader || group.grade == .manager {
            children.append(inviteInfoAction)
        }
        children.append(contentsOf: [appInfoAction, logoutAction])
        moreItem.menu = UIMenu(children: children)

        navigationItem.rightBarButtonItems = [profileItem, moreItem]
    }
    
    @objc func avatarImageTapAction() {
        coordinator?.moveToGroupInfoViewController(group: viewModel.group)
    }
    
    func selectFirstCategory() {
        let firstIndexPath = IndexPath(item: 0, section: 0)
        layoutView.categoryCollectionView.selectItem(at: firstIndexPath, animated: false, scrollPosition: .init())
        collectionView(layoutView.categoryCollectionView.self, didSelectItemAt: firstIndexPath)
    }
    
    func inviteMember() {
        showTextFieldAlert(
            title: "그룹원 초대",
            okTitle: "초대",
            placeholder: "초대할 유저의 7자리 유저코드를 입력하세요.",
            okAction: { text in
                guard let text = text else { return }
                print("초대할 유저코드: \(text)")
                self.viewModel.action(.invite(userCode: text))
            }
        )
    }
    
    func moveToAppInfoViewController() {
        coordinator?.moveToAppInfoViewController()
    }
    
    func logout() {
        showTwoButtonAlert(
            title: "로그아웃",
            message: "정말 로그아웃을 하시겠습니까?",
            okTitle: "로그아웃",
            okAction: {
                self.viewModel.action(.logout)
            }
        )
    }
}

// MARK: - UICollectionViewDelegate
extension GroupHomeViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        
        if let cell = collectionView.cellForItem(at: indexPath) as? CategoryCollectionViewCell {
            // 카테고리 셀을 눌렀을 때
            categoryCellDidSelected(cell: cell, row: indexPath.row)
        } else if let _ = collectionView.cellForItem(at: indexPath) as? AchievementCollectionViewCell {
            // 달성 기록 리스트 셀을 눌렀을 때
            // 상세 정보 화면으로 이동
//            let achievement = viewModel.findAchievement(at: indexPath.row)
            let testAchievement = Achievement(
                id: 1,
                category: .init(id: 1, name: "테스트", continued: 10, lastChallenged: .now),
                title: "테스트 제목",
                imageURL: URL(string: "https://serverless-thumbnail.kr.object.ncloudstorage.com/./049038f8-6984-46f6-8481-d2fafb507fe7.jpeg"),
                body: "테스트 내용입니다.",
                date: .now
            )
            coordinator?.moveToGroupDetailAchievementViewController(
                achievement: testAchievement,
                group: viewModel.group
            )
        }
    }
    
    private func categoryCellDidSelected(cell: CategoryCollectionViewCell, row: Int) {
        // 눌렸을 때 Bounce 적용
        // Highlight에만 적용하면 Select에서는 적용이 안 되서 별도로 적용함
        UIView.animate(withDuration: 0.08, animations: {
            cell.applyHighlightUI()
            let scale = CGAffineTransform(scaleX: 0.95, y: 0.95)
            cell.transform = scale
        }, completion: { _ in
            cell.transform = .identity
        })
        
        guard let category = viewModel.findCategory(at: row) else { return }
        Logger.debug("Selected Group Category: \(category.name)")
        viewModel.action(.fetchAchievementList(category: category))
        layoutView.updateAchievementHeader(with: category)
    }
    
    func collectionView(
        _ collectionView: UICollectionView,
        willDisplaySupplementaryView view: UICollectionReusableView,
        forElementKind elementKind: String,
        at indexPath: IndexPath
    ) {
        guard elementKind == UICollectionView.elementKindSectionHeader,
              let headerView = view as? HeaderView else { return }
        
        if let currentCategory = viewModel.currentCategory {
            headerView.configure(category: currentCategory)
        }
    }
    
    func collectionView(_ collectionView: UICollectionView, didEndDisplaying cell: UICollectionViewCell, forItemAt indexPath: IndexPath) {
        guard let cell = cell as? AchievementCollectionViewCell else { return }
        cell.cancelDownloadImage()
    }

    func collectionView(
        _ collectionView: UICollectionView,
        contextMenuConfigurationForItemsAt indexPaths: [IndexPath],
        point: CGPoint
    ) -> UIContextMenuConfiguration? {
        guard collectionView == layoutView.achievementCollectionView,
              let firstIndexPath = indexPaths.first else { return nil }
        
        let selectedItem = viewModel.findAchievement(at: firstIndexPath.row)
        let isMyAchievement = viewModel.isMyAchievement(achievement: selectedItem)
        let grade = viewModel.group.grade
        
        let config = UIContextMenuConfiguration(identifier: nil, previewProvider: nil) { [weak self] _ in
            // 작성자 본인에게만 표시
            let editAction = UIAction(title: "수정", handler: { _ in
                self?.viewModel.action(.fetchDetailAchievement(achievementId: selectedItem.id))
            })
            // 작성자 본인, 관리자, 그룹장에게 표시
            let deleteAction = UIAction(title: "삭제", attributes: .destructive, handler: { _ in
                self?.showDestructiveTwoButtonAlert(
                    title: "정말로 삭제하시겠습니까?",
                    message: "삭제된 도전 기록은 되돌릴 수 없습니다."
                ) {
                    self?.viewModel.action(.deleteAchievement(achievementId: selectedItem.id, categoryId: selectedItem.categoryId))
                }
            })
            // 작성자가 아닌 유저에게만 표시
            let blockingAchievementAction = UIAction(title: "도전기록 차단", attributes: .destructive, handler: { _ in
                self?.viewModel.action(.blockingAchievement(achievementId: selectedItem.id))
            })
            // 작성자가 아닌 유저에게만 표시
            let blockingUserAction = UIAction(title: "사용자 차단", attributes: .destructive, handler: { _ in
                self?.viewModel.action(.blockingUser(userCode: selectedItem.userCode))
            })
            
            var children: [UIAction] = []
            if isMyAchievement {
                children.append(contentsOf: [editAction, deleteAction])
            } else if grade == .leader || grade == .manager {
                children.append(contentsOf: [deleteAction])
            } 
            
            // 그룹장, 관리자에게도 표시하기 위해 조건문 분리
            if !isMyAchievement {
                children.append(contentsOf: [blockingAchievementAction, blockingUserAction])
            }
            
            return UIMenu(
                title: selectedItem.title,
                options: .displayInline,
                children: children
            )
        }

        return config

    }
}

// MARK: - Binding
private extension GroupHomeViewController {
    private func bind() {
        bindAchievement()
        bindCategory()
        bindGroup()
    }
    
    func bindAchievement() {
        viewModel.achievementListState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                // state 에 따른 뷰 처리 - 스켈레톤 뷰, fetch 에러 뷰 등
                Logger.debug(state)
                switch state {
                case .loading:
                    break
                case .finish:
                    break
                case .error(let message):
                    Logger.error("Fetch Achievement Error: \(message)")
                }
            }
            .store(in: &cancellables)
        
        viewModel.fetchDetailAchievementState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                case .finish(let achievement):
                    hideLoadingIndicator()
                    coordinator?.moveToEditAchievementViewController(achievement: achievement)
                case .error(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
        
        viewModel.deleteAchievementState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                case .success:
                    hideLoadingIndicator()
                case .failed:
                    hideLoadingIndicator()
                    showErrorAlert(message: "제거에 실패했습니다. 다시 시도해 주세요.")
                case .error(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
    }
    
    func bindCategory() {
        viewModel.categoryListState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] categoryState in
                guard let self else { return }
                switch categoryState {
                case .loading:
                    break
                case .finish:
                    // 첫 번째 아이템 선택
                    self.selectFirstCategory()
                case .error(let message):
                    Logger.error("Category State Error: \(message)")
                }
            }
            .store(in: &cancellables)

        viewModel.addCategoryState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    layoutView.categoryAddButton.isEnabled = false
                case .finish:
                    layoutView.categoryAddButton.isEnabled = true
                case .error(let message):
                    layoutView.categoryAddButton.isEnabled = true
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)

    }
    
    func bindGroup() {
        viewModel.inviteMemberState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                case .success(let userCode):
                    hideLoadingIndicator()
                    showOneButtonAlert(title: "초대 성공", message: "\(userCode)님을 그룹에 초대했습니다.")
                case .failed:
                    hideLoadingIndicator()
                    showErrorAlert(title: "초대 실패", message: "초대를 실패했습니다. 다시 시도해 주세요.")
                case .error(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
    }
}

// MARK: - UITextFieldDelegate
extension GroupHomeViewController: UITextFieldDelegate {
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        guard let text = textField.text else { return true }
        let newLength = text.count + string.count - range.length
        return newLength <= 10
    }
}
