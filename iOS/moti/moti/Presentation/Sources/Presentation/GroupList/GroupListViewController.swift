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
        
        viewModel.action(.launch)
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
}

// MARK: - Setup
private extension GroupListViewController {
    func setupUI() {
        setupNavigationBar()
    }
    
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
        let editGroupItem = UIBarButtonItem(
            title: "편집", style: .plain, target: self,
            action: nil
        )
        
        let createGroupItem = UIBarButtonItem(
            title: "생성", style: .plain, target: self,
            action: #selector(showCreateGroupTextFieldAlert)
        )

        navigationItem.rightBarButtonItems = [profileItem, createGroupItem, editGroupItem]
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
        return newLength <= 10
    }
}

// MARK: - Bind
extension GroupListViewController: LoadingIndicator {
    func bind() {
        viewModel.groupListState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    // TODO: 스켈레톤
                    showLoadingIndicator()
                    break
                case .finish:
                    hideLoadingIndicator()
                case .error(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
        
        viewModel.createGroupState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                    break
                case .finish:
                    hideLoadingIndicator()
                case .error(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
    }
}
