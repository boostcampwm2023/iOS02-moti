//
//  GroupListViewController.swift
//  
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Core
import Design
import Combine
import JKImageCache

final class GroupListViewController: BaseViewController<GroupListView> {

    // MARK: - Properties
    weak var coordinator: GroupListCoordinator?
    private let viewModel: GroupListViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    // MARK: - Init
    init(viewModel: GroupListViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupGroupListDataSource()
        bind()
        
        viewModel.action(.launch)
    }
    
    func dropGroup(groupId: Int) {
        viewModel.action(.dropGroup(groupId: groupId))
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        if let tabBarController = tabBarController as? TabBarViewController {
            tabBarController.showTabBar()
            tabBarController.hideCaptureButton()
        }
        
        viewModel.action(.refetch)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        if let tabBarController = tabBarController as? TabBarViewController {
            tabBarController.showCaptureButton()
        }
    }

    private func setupGroupListDataSource() {
        layoutView.groupListCollectionView.delegate = self
        let dataSource = GroupListViewModel.GroupDataSource.DataSource(
            collectionView: layoutView.groupListCollectionView,
            cellProvider: { collectionView, indexPath, item in
                let cell: GroupListCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                
                if item.id < 0 {
                    cell.showSkeleton()
                } else {
                    cell.hideSkeleton()
                    cell.configure(with: item)
                }
                
                return cell
            }
        )
        
        let diffableDataSource = GroupListViewModel.GroupDataSource(dataSource: dataSource)
        viewModel.setupGroupDataSource(diffableDataSource)
    }

    // MARK: - Actions
    @objc private func showCreateGroupTextFieldAlert() {
        let textFieldAlertVC = AlertFactory.makeTextFieldAlert(
            title: "생성할 그룹 이름을 입력하세요.",
            okTitle: "생성",
            placeholder: "그룹 이름은 최대 10글자입니다.",
            okAction: { [weak self] text in
                guard let self, let text else { return }
                Logger.debug("그룹 생성 입력: \(text)")
                viewModel.action(.createGroup(groupName: text))
            })
        
        if let textField = textFieldAlertVC.textFields?.first {
            textField.delegate = self
        }
        
        present(textFieldAlertVC, animated: true)
    }
    
    @objc private func showJoinGroupTextFieldAlert() {
        showTextFieldAlert(
            title: "그룹 참가",
            okTitle: "참가",
            placeholder: "7자리 그룹코드를 입력하세요.",
            okAction: { [weak self] text in
                guard let self, let text else { return }
                Logger.debug("그룹 참가 입력: \(text)")
                viewModel.action(.join(groupCode: text))
            }
        )
    }
}

// MARK: - Setup
private extension GroupListViewController {
    func setupUI() {
        setupNavigationBar()
    }
    
    func setupNavigationBar() {
        let logoItem = UIImageView(image: MotiImage.logoBlue)
        logoItem.isAccessibilityElement = true
        logoItem.accessibilityLabel = "모티 로고"
        logoItem.contentMode = .scaleAspectFit
        let leftItem = UIBarButtonItem(customView: logoItem)
        leftItem.customView?.atl
            .width(constant: 60)
        navigationItem.leftBarButtonItem = leftItem

        // 프로필 버튼
        let avatarItemSize: CGFloat = 34
        let avatarImageView = UIImageView()
        avatarImageView.isAccessibilityElement = true
        avatarImageView.accessibilityLabel = "개인 프로필"
        avatarImageView.contentMode = .scaleAspectFit
        avatarImageView.clipsToBounds = true
        avatarImageView.layer.cornerRadius = avatarItemSize / 2
        if let myAvatarURLString = UserDefaults.standard.readString(key: .myAvatarUrlString),
           let myAvatarURL = URL(string: myAvatarURLString) {
            avatarImageView.jk.setImage(with: myAvatarURL, downsamplingScale: 1.5)
        } else {
            avatarImageView.backgroundColor = .primaryGray
        }
        let avatarImageTapGesture = UITapGestureRecognizer(target: self, action: #selector(showUserCode))
        avatarImageView.isUserInteractionEnabled = true
        avatarImageView.addGestureRecognizer(avatarImageTapGesture)
        
        let profileItem = UIBarButtonItem(customView: avatarImageView)
        profileItem.customView?.atl
            .size(width: avatarItemSize, height: avatarItemSize)
        
        let createGroupItem = UIBarButtonItem(
            title: "생성", style: .plain, target: self,
            action: #selector(showCreateGroupTextFieldAlert)
        )
        
        let joinGroupItem = UIBarButtonItem(
            title: "참가", style: .plain, target: self,
            action: #selector(showJoinGroupTextFieldAlert)
        )

        navigationItem.rightBarButtonItems = [profileItem, createGroupItem, joinGroupItem]
    }
    
    @objc func showUserCode() {
        if let userCode = UserDefaults.standard.readString(key: .myUserCode) {
            showTwoButtonAlert(title: "유저 코드", message: userCode, okTitle: "확인", cancelTitle: "클립보드 복사", cancelAction: {
                UIPasteboard.general.string = userCode
            })
        }
    }
}

extension GroupListViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        guard let cell = collectionView.cellForItem(at: indexPath) as? GroupListCollectionViewCell else {
            return
        }

        UIView.animate(withDuration: 0.08, animations: {
            let scale = CGAffineTransform(scaleX: 0.95, y: 0.95)
            cell.transform = scale
        }, completion: { _ in
            cell.transform = .identity
        })

        let selectedGroup = viewModel.findGroup(at: indexPath.row)
        Logger.debug("Clicked \(selectedGroup)")
        coordinator?.moveToGroupHomeViewController(group: selectedGroup)
    }
}

// MARK: - UITextFieldDelegate
extension GroupListViewController: UITextFieldDelegate {
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        guard let text = textField.text else { return true }
        let newLength = text.count + string.count - range.length
        return newLength <= 11
    }
}

// MARK: - Bind
extension GroupListViewController: LoadingIndicator {
    func bind() {
        bindGroupList()
        bindGroup()
    }
    
    func bindGroupList() {
        viewModel.$groupListState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none:
                    break
                case .loading:
                    // TODO: 스켈레톤
                    showLoadingIndicator()
                case .finish:
                    hideLoadingIndicator()
                case .error(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
        
        viewModel.refetchGroupListState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                case .finishSame:
                    hideLoadingIndicator()
                case .finishDecreased:
                    hideLoadingIndicator()
                    showOneButtonAlert(title: "그룹에서 탈퇴되었습니다.")
                case .finishIncreased:
                    hideLoadingIndicator()
                    showOneButtonAlert(title: "새로운 그룹이 있습니다!")
                case .error(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
        
    }
    
    func bindGroup() {
        viewModel.createGroupState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                case .finish:
                    hideLoadingIndicator()
                case .error(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
        
        viewModel.dropGroupState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                case .finish:
                    hideLoadingIndicator()
                case .error(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
        
        viewModel.joinGroupState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                case .finish:
                    hideLoadingIndicator()
                    viewModel.action(.refetch)
                case .error(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
    }
}
