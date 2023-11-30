//
//  GroupListCoordinator.swift
//
//
//  Created by 유정주 on 11/30/23.
//

import UIKit
import Core
import Domain

final class GroupListCoordinator: Coordinator {
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
    
    func start() {
        let groupVM = GroupListViewModel()
        let groupListVC = GroupListViewController(viewModel: groupVM)
        groupListVC.coordinator = self
        navigationController.viewControllers = [groupListVC]
    }
    
    func moveToGroupHomeViewController(group: Group) {
        let groupHomeCoordinator = GroupHomeCoordinator(navigationController, self)
        groupHomeCoordinator.start(group: group)
        childCoordinators.append(groupHomeCoordinator)
    }
}
