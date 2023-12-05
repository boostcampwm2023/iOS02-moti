//
//  GroupDetailAchievementCoordinator.swift
//  
//
//  Created by 유정주 on 12/3/23.
//

import UIKit
import Core
import Domain

protocol GroupDetailAchievementCoordinatorDelegate: DetailAchievementCoordinatorDelegate {
    
}

final class GroupDetailAchievementCoordinator: Coordinator {
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
    
    func start(achievement: Achievement, group: Group) {
        let groupDetailAchievementVM = GroupDetailAchievementViewModel(achievement: achievement, group: group)
        let groupDetailAchievementVC = GroupDetailAchievementViewController(viewModel: groupDetailAchievementVM)
        groupDetailAchievementVC.coordinator = self
        navigationController.pushViewController(groupDetailAchievementVC, animated: true)
    }
    
}
