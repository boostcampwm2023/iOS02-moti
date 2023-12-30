//
//  GroupInfoViewController.swift
//
//
//  Created by Kihyun Lee on 12/4/23.
//

import UIKit
import Design
import Domain
import Combine

final class GroupInfoViewController: BaseViewController<GroupInfoView>, HiddenTabBarViewController {

    // MARK: - Properties
    weak var coordinator: GroupInfoCoordinator?
    private let group: Group
    private let dataSource = GroupInfoTableViewDataSource()
    private let viewModel: GroupInfoViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    // MARK: - Init
    init(group: Group, viewModel: GroupInfoViewModel) {
        self.group = group
        if group.grade == .leader {
            dataSource.appendLeaderSection()
        }
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        bind()
        
        title = "그룹 정보"
        layoutView.configure(group: group)
        layoutView.tableView.delegate = self
        layoutView.tableView.dataSource = dataSource
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        layoutView.cancelDownloadImage()
    }
}

extension GroupInfoViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if dataSource.isGroupMemberCell(indexPath: indexPath) {
            coordinator?.moveToGroupMemberViewController(group: group, manageMode: false)
        } else if dataSource.isLeaderCell(indexPath: indexPath) {
            coordinator?.moveToGroupMemberViewController(group: group, manageMode: true)
        } else if dataSource.isDropCell(indexPath: indexPath) {
            if group.grade == .leader {
                showErrorAlert(title: "그룹장은 탈퇴할 수 없습니다.")
            } else {
                showDestructiveTwoButtonAlert(title: "그룹에서 탈퇴하시겠습니까?", okTitle: "탈퇴") { [weak self] in
                    guard let self else { return }
                    viewModel.action(.dropGroup(groupId: group.id))
                }
            }
        } else if dataSource.isBlockCell(indexPath: indexPath) {
            coordinator?.moveToBlockedUserListViewController(group: group)
        }
    }
}

// MARK: - bind
extension GroupInfoViewController: LoadingIndicator {
    private func bind() {
        viewModel.dropGroupState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                case .finish:
                    hideLoadingIndicator()
                    coordinator?.parentCoordinator?.finish(animated: true)
                    coordinator?.finish(animated: true)
                    // coordinator.finish를 먼저하면 coordinator가 없어져서 parent에 접근할 수 없음
                case .error(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
    }
}
