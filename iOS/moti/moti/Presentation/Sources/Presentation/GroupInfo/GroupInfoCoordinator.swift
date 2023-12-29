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

final class GroupInfoCoordinator: Coordinator {
    var parentCoordinator: Coordinator?
    var childCoordinators: [Coordinator] = []
    var navigationController: UINavigationController
    
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
    
    func moveToBlockUserViewController(group: Group) {
        let blockUserCoordinator = BlockUserCoordinator(navigationController, self)
        blockUserCoordinator.start(group: group)
        childCoordinators.append(blockUserCoordinator)
    }
}
