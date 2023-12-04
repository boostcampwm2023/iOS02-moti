//
//  GroupMemberCoordinator.swift
//  
//
//  Created by Kihyun Lee on 12/5/23.
//

import UIKit
import Core
import Domain
import Data

final class GroupMemberCoordinator: Coordinator {
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
        let groupMemberVM = GroupMemberViewModel(
            fetchGroupMemberListUseCase: .init(groupRepository: GroupRepository()),
            group: group
        )
        let groupMemberVC = GroupMemberViewController(viewModel: groupMemberVM)
        groupMemberVC.coordinator = self
        navigationController.pushViewController(groupMemberVC, animated: true)
    }
}
