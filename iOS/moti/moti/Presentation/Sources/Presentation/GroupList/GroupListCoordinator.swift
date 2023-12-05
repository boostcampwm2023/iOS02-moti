//
//  GroupListCoordinator.swift
//
//
//  Created by 유정주 on 11/30/23.
//

import UIKit
import Core
import Domain
import Data

final class GroupListCoordinator: Coordinator {
    var parentCoordinator: Coordinator?
    var childCoordinators: [Coordinator] = []
    var navigationController: UINavigationController
    private var currentViewController: GroupListViewController?
    
    init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    func start() {
        let groupRepository = GroupRepository()
        let groupVM = GroupListViewModel(
            fetchGroupListUseCase: .init(groupRepository: groupRepository),
            createGroupUseCase: .init(groupRepository: groupRepository), 
            dropGroupUseCase: .init(groupRepository: groupRepository)
        )
        let groupListVC = GroupListViewController(viewModel: groupVM)
        groupListVC.coordinator = self
        currentViewController = groupListVC
        navigationController.viewControllers = [groupListVC]
    }
    
    func moveToGroupHomeViewController(group: Group) {
        let groupHomeCoordinator = GroupHomeCoordinator(navigationController, self)
        groupHomeCoordinator.delegate = self
        groupHomeCoordinator.start(group: group)
        childCoordinators.append(groupHomeCoordinator)
    }
}

extension GroupListCoordinator: GroupHomeCoordinatorDelegate {
    func dropCellDidClicked(groupId: Int) {
        currentViewController?.dropGroup(groupId: groupId)
    }
}
