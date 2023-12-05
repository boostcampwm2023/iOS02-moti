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
        let groupAchievementRepository = GroupAchievementRepository(groupId: group.id)
        let groupCategoryRepository = GroupCategoryRepository(groupId: group.id)
        let groupHomeVM = GroupHomeViewModel(
            group: group,
            fetchAchievementListUseCase: .init(repository: groupAchievementRepository),
            fetchCategoryListUseCase: .init(repository: groupCategoryRepository),
            addCategoryUseCase: .init(repository: groupCategoryRepository),
            deleteAchievementUseCase: .init(repository: groupAchievementRepository, storage: nil),
            fetchDetailAchievementUseCase: .init(repository: groupAchievementRepository)
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
    
    func moveToEditAchievementViewController(achievement: Achievement) {
        let editAchievementCoordinator = EditAchievementCoordinator(navigationController, self)
        editAchievementCoordinator.delegate = self
        childCoordinators.append(editAchievementCoordinator)
        editAchievementCoordinator.start(achievement: achievement)
    }

}

// MARK: - EditAchievementCoordinatorDelegate
extension GroupHomeCoordinator: EditAchievementCoordinatorDelegate {
    func doneButtonDidClicked(achievement: Achievement) {
        currentViewController?.updateAchievement(updatedAchievement: achievement)
    }
}
