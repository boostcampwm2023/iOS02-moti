//
//  HomeViewController.swift
//  
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Combine
import Core
import Data
import Design
import Domain

protocol HomeViewControllerDelegate: AnyObject {
    func editMenuDidClicked(achievement: Achievement)
}

final class HomeViewController: BaseViewController<HomeView> {

    // MARK: - Properties
    weak var coordinator: HomeCoordinator?
    weak var delegate: HomeViewControllerDelegate?
    private let viewModel: HomeViewModel
    private var cancellables: Set<AnyCancellable> = []
    private var isFetchingNextPage = false
    
    init(viewModel: HomeViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNavigationBar()
        addTargets()
        bind()
        
        setupAchievementDataSource()
        setupCategoryDataSource()
        
        viewModel.action(.launch)
    }
    
    // MARK: - Methods
    func deleteAchievementDataSourceItem(achievementId: Int) {
        viewModel.action(.deleteAchievementDataSourceItem(achievementId: achievementId))
    }
    
    func updateAchievement(updatedAchievement: Achievement) {
        viewModel.action(.updateAchievement(updatedAchievement: updatedAchievement))
    }
    
    func achievementDidPosted(newAchievement: Achievement) {
        viewModel.action(.postAchievement(newAchievement: newAchievement))
    }
    
    private func addTargets() {
        layoutView.catergoryAddButton.addTarget(self, action: #selector(showCreateCategoryAlert), for: .touchUpInside)
    }
    
    @objc private func showCreateCategoryAlert() {
        showTextFieldAlert(
            title: "추가할 카테고리 이름을 입력하세요.",
            okTitle: "생성",
            placeholder: "카테고리 이름은 최대 10글자입니다."
        ) { [weak self] text in
            guard let self, let text else { return }
            viewModel.action(.addCategory(name: text))
        }
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
    
    private func selectFirstCategory() {
        let firstIndexPath = IndexPath(item: 0, section: 0)
        layoutView.categoryCollectionView.selectItem(at: firstIndexPath, animated: false, scrollPosition: .init())
        collectionView(layoutView.categoryCollectionView.self, didSelectItemAt: firstIndexPath)
    }
}

// MARK: - NavigationBar
private extension HomeViewController {
    func setupNavigationBar() {
        let logoItem = UIImageView(image: MotiImage.logoBlue)
        logoItem.contentMode = .scaleAspectFit
        let leftItem = UIBarButtonItem(customView: logoItem)
        leftItem.customView?.atl
            .width(constant: 60)
        navigationItem.leftBarButtonItem = leftItem
        
        // 오른쪽 프로필 버튼
        let profileImage = UIImage(
            systemName: "person.crop.circle.fill",
            withConfiguration: UIImage.SymbolConfiguration(font: .large)
        )
        let profileButton = UIButton(type: .system)
        profileButton.setImage(profileImage, for: .normal)
        profileButton.contentMode = .scaleAspectFit
        profileButton.tintColor = .primaryDarkGray
        let profileItem = UIBarButtonItem(customView: profileButton)
        
        // 오른쪽 더보기 버튼
        let moreItem = UIBarButtonItem(
            image: SymbolImage.ellipsisCircle,
            style: .done,
            target: self,
            action: nil
        )
        let appInfoAction = UIAction(title: "앱 정보", handler: { _ in
            self.moveToAppInfoViewController()
        })
        moreItem.menu = UIMenu(children: [appInfoAction])
        
        navigationItem.rightBarButtonItems = [profileItem, moreItem]
    }
    
    func moveToAppInfoViewController() {
        coordinator?.moveToAppInfoViewController()
    }
}

// MARK: - UICollectionViewDelegate
extension HomeViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        
        if let cell = collectionView.cellForItem(at: indexPath) as? CategoryCollectionViewCell {
            // 카테고리 셀을 눌렀을 때
            categoryCellDidSelected(cell: cell, row: indexPath.row)
        } else if let cell = collectionView.cellForItem(at: indexPath) as? AchievementCollectionViewCell {
            // 달성 기록 리스트 셀을 눌렀을 때
            // 상세 정보 화면으로 이동
            let achievement = viewModel.findAchievement(at: indexPath.row)
            coordinator?.moveToDetailAchievementViewController(achievement: achievement)
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
        Logger.debug("Selected Category: \(category.name)")
        viewModel.action(.fetchAchievementList(category: category))
        layoutView.updateAchievementHeader(with: category)
    }
    
    func collectionView(_ collectionView: UICollectionView, willDisplaySupplementaryView view: UICollectionReusableView, forElementKind elementKind: String, at indexPath: IndexPath) {
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
    
    func collectionView(_ collectionView: UICollectionView, contextMenuConfigurationForItemsAt indexPaths: [IndexPath], point: CGPoint) -> UIContextMenuConfiguration? {
        guard let firstIndexPath = indexPaths.first else { return nil }
        
        let selectedItem = viewModel.findAchievement(at: firstIndexPath.row)
        
        let config = UIContextMenuConfiguration(identifier: nil, previewProvider: nil) { [weak self] _ in
            let editAchievementAction = UIAction(title: "수정") { _ in
                self?.viewModel.action(.fetchDetailAchievement(achievementId: selectedItem.id))
            }
            
            let deleteAchievementAction = UIAction(title: "삭제", attributes: .destructive) { _ in
                self?.showDestructiveTwoButtonAlert(
                    title: "정말로 삭제하시겠습니까?",
                    message: "삭제된 도전 기록은 되돌릴 수 없습니다."
                ) {
                    self?.viewModel.action(.deleteAchievement(achievementId: selectedItem.id, categoryId: 1))
                }
            }
            
            return UIMenu(options: .displayInline, children: [editAchievementAction, deleteAchievementAction])
        }

        return config
    }
    
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let actualPos = scrollView.panGestureRecognizer.translation(in: scrollView.superview)
        let pos = scrollView.contentOffset.y
        let diff = layoutView.achievementCollectionView.contentSize.height - scrollView.frame.size.height
        
        // 아래로 드래그 && 마지막까지 스크롤
        if actualPos.y < 0 && pos > diff && !isFetchingNextPage {
            Logger.debug("Fetch New Data")
            isFetchingNextPage = true
            viewModel.action(.fetchNextPage)
        }
    }
}

// MARK: - Binding
private extension HomeViewController {
    func bind() {
        bindAchievement()
        bindCategory()
    }
    
    func bindAchievement() {
        viewModel.$achievementListState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                // state 에 따른 뷰 처리 - 스켈레톤 뷰, fetch 에러 뷰 등
                Logger.debug(state)
                switch state {
                case .finish:
                    isFetchingNextPage = false
                case .error(let message):
                    isFetchingNextPage = false
                    Logger.error("Fetch Achievement Error: \(message)")
                default: break
                }
                
            }
            .store(in: &cancellables)
        
        viewModel.fetchDetailAchievementState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none: break
                case .loading:
                    // TODO: Loading Indicator 표시
                    break
                case .finish(let achievement):
                    // TODO: Loading Indicator 제거
                    print("detail: \(achievement)")
                    coordinator?.moveToEditAchievementViewController(achievement: achievement)
                case .error(let message):
                    // TODO: Loading Indicator 제거
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
        
        viewModel.deleteAchievementState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none: break
                case .loading:
                    // TODO: Loading Indicator 표시
                    break
                case .success:
                    // TODO: Loading Indicator 제거
                    break
                case .failed:
                    // TODO: Loading Indicator 제거
                    showErrorAlert(message: "제거에 실패했습니다. 다시 시도해 주세요.")
                case .error(let message):
                    // TODO: Loading Indicator 제거
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
    }
    
    func bindCategory() {
        viewModel.$categoryListState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] categoryState in
                guard let self else { return }
                switch categoryState {
                case .initial:
                    // TODO: 스켈레톤
                    break
                case .finish:
                    // 첫 번째 아이템 선택
                    self.selectFirstCategory()
                case .error(let message):
                    Logger.error("Category State Error: \(message)")
                }
            }
            .store(in: &cancellables)
        
        viewModel.$categoryState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .initial: break
                case .updated(let updatedCategory):
                    layoutView.updateAchievementHeader(with: updatedCategory)
                }
            }
            .store(in: &cancellables)
        
        viewModel.$addCategoryState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none: break
                case .loading:
                    layoutView.catergoryAddButton.isEnabled = false
                case .finish:
                    layoutView.catergoryAddButton.isEnabled = true
                case .error(let message):
                    layoutView.catergoryAddButton.isEnabled = true
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
    }
}
