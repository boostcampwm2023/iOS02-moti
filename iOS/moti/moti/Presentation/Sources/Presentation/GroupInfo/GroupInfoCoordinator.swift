//
//  GroupInfoCoordinator.swift
//
//
//  Created by Kihyun Lee on 12/4/23.
//

import UIKit
import Core
import Domain

protocol GroupInfoCoordinatorDelegate: AnyObject {
    func dropCellDidClicked(groupId: Int)
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
        let groupInfoVC = GroupInfoViewController(group: group)
        groupInfoVC.coordinator = self
        groupInfoVC.delegate = self
        navigationController.pushViewController(groupInfoVC, animated: true)
    }
    
    func moveToGroupMemberViewController(group: Group, manageMode: Bool) {
        let groupMemberCoordinator = GroupMemberCoordinator(navigationController, self)
        groupMemberCoordinator.start(group: group, manageMode: manageMode)
        childCoordinators.append(groupMemberCoordinator)
    }
}

extension GroupInfoCoordinator: GroupInfoViewControllerDelegate {
    func dropCellDidClicked(groupId: Int) {
        finish(animated: true)
        delegate?.dropCellDidClicked(groupId: groupId)
    }
}
