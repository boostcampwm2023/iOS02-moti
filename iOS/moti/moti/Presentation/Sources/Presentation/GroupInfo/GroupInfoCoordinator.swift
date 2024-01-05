//
//  GroupInfoCoordinator.swift
//
//
//  Created by Kihyun Lee on 12/4/23.
//

import UIKit
import Core
import Domain
import Data

protocol GroupInfoCoordinatorDelegate: AnyObject {
    func unblockUserIsSuccess()
}

final class GroupInfoCoordinator: Coordinator {
    var parentCoordinator: Coordinator?
    var childCoordinators: [Coordinator] = []
    var navigationController: UINavigationController
    weak var delegate: GroupInfoCoordinatorDelegate?
    
    init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    func start() { }
    
    func start(group: Group) {
        let groupInfoVC = GroupInfoViewController(
            group: group,
            viewModel: .init(dropGroupUseCase: .init(groupRepository: GroupRepository()))
        )
        groupInfoVC.coordinator = self
        navigationController.pushViewController(groupInfoVC, animated: true)
    }
    
    func moveToGroupMemberViewController(group: Group, manageMode: Bool) {
        let groupMemberCoordinator = GroupMemberCoordinator(navigationController, self)
        groupMemberCoordinator.start(group: group, manageMode: manageMode)
        childCoordinators.append(groupMemberCoordinator)
    }
    
    func moveToBlockedUserListViewController(group: Group) {
        let blockedUserListCoordinator = BlockedUserListCoordinator(navigationController, self)
        blockedUserListCoordinator.delegate = self
        blockedUserListCoordinator.start(group: group)
        childCoordinators.append(blockedUserListCoordinator)
    }
}

extension GroupInfoCoordinator: BlockedUserListCoordinatorDelegate {
    func unblockedUser() {
        delegate?.unblockUserIsSuccess()
    }
}
