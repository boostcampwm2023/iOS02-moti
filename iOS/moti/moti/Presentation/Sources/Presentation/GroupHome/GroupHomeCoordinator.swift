//
//  GroupHomeCoordinator.swift
//  
//
//  Created by 유정주 on 11/30/23.
//

import UIKit
import Core
import Domain
import Data

final class GroupHomeCoordinator: Coordinator {
    public let parentCoordinator: Coordinator?
    public var childCoordinators: [Coordinator] = []
    public let navigationController: UINavigationController
    private var currentViewController: GroupHomeViewController?
        
    public init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    func start() { }
    
    func start(group: Group) {
        let groupHomeVM = GroupHomeViewModel(
            group: group,
            fetchAchievementListUseCase: .init(repository: GroupAchievementRepository(groupId: group.id)),
            fetchCategoryListUseCase: .init(repository: GroupCategoryRepository(groupId: group.id)),
            addCategoryUseCase: .init(repository: GroupCategoryRepository(groupId: group.id))
        )
        let groupHomeVC = GroupHomeViewController(viewModel: groupHomeVM)
        groupHomeVC.coordinator = self
        currentViewController = groupHomeVC
        navigationController.pushViewController(groupHomeVC, animated: true)
    }
    
    func moveToGroupDetailAchievementViewController(achievement: Achievement, group: Group) {
        let groupDetailAchievementCoordinator = GroupDetailAchievementCoordinator(navigationController, self)
        groupDetailAchievementCoordinator.start(achievement: achievement, group: group)
        childCoordinators.append(groupDetailAchievementCoordinator)
    }
    
    func moveToGroupInfoViewController(group: Group) {
        let groupInfoCoordinator = GroupInfoCoordinator(navigationController, self)
        groupInfoCoordinator.start(group: group)
        childCoordinators.append(groupInfoCoordinator)
    }
    
    func moveToAppInfoViewController() {
        let appInfoCoordinator = AppInfoCoordinator(navigationController, self)
        childCoordinators.append(appInfoCoordinator)
        appInfoCoordinator.start()
    }
}
