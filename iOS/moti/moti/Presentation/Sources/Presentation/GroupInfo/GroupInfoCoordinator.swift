//
//  GroupInfoCoordinator.swift
//
//
//  Created by Kihyun Lee on 12/4/23.
//

import UIKit
import Core
import Domain

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
        let groupInfoVC = GroupInfoViewController(group: group)
        groupInfoVC.coordinator = self
        navigationController.pushViewController(groupInfoVC, animated: true)
    }
    
    func moveToGroupMemberViewController(group: Group) {
        let groupMemberCoordinator = GroupMemberCoordinator(navigationController, self)
        groupMemberCoordinator.start(group: group)
        childCoordinators.append(groupMemberCoordinator)
    }
}
