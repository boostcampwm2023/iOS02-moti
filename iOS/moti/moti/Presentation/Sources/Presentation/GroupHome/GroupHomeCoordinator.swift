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
        let blockingRepository = BlockingRepository(groupId: group.id)
        let groupAchievementRepository = GroupAchievementRepository(groupId: group.id)
        let groupCategoryRepository = GroupCategoryRepository(groupId: group.id)
        let groupHomeVM = GroupHomeViewModel(
            group: group,
            fetchAchievementListUseCase: .init(repository: groupAchievementRepository), 
            fetchCategoryUseCase: .init(repository: groupCategoryRepository),
            fetchCategoryListUseCase: .init(repository: groupCategoryRepository),
            addCategoryUseCase: .init(repository: groupCategoryRepository),
            deleteAchievementUseCase: .init(repository: groupAchievementRepository, storage: nil),
            fetchDetailAchievementUseCase: .init(repository: groupAchievementRepository),
            blockingUserUseCase: .init(blockingRepository: blockingRepository),
            blockingAchievementUseCase: .init(blockingRepository: blockingRepository), 
            inviteMemberUseCase: .init(repository: GroupMemberRepository(groupId: group.id))
        )
        let groupHomeVC = GroupHomeViewController(viewModel: groupHomeVM)
        groupHomeVC.coordinator = self
        currentViewController = groupHomeVC
        navigationController.pushViewController(groupHomeVC, animated: true)
    }
    
    func moveToGroupDetailAchievementViewController(achievement: Achievement, group: Group) {
        let groupDetailAchievementCoordinator = GroupDetailAchievementCoordinator(navigationController, self, group: group)
        groupDetailAchievementCoordinator.start(achievement: achievement)
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

    func moveToCaptureViewController(group: Group) {
        let captureCoordinator = CaptureCoordinator(navigationController, self, group: group)
        captureCoordinator.delegate = self
        captureCoordinator.start()
        childCoordinators.append(captureCoordinator)
    }
}

// MARK: - EditAchievementCoordinatorDelegate
extension GroupHomeCoordinator: EditAchievementCoordinatorDelegate {
    func doneButtonDidClicked(achievement: Achievement) {
        currentViewController?.updateAchievement(updatedAchievement: achievement)
    }
}

// MARK: - GroupDetailAchievementCoordinatorDelegate
extension GroupHomeCoordinator: GroupDetailAchievementCoordinatorDelegate {
    func deleteButtonDidClicked(achievementId: Int) {
        currentViewController?.deleteAchievementDataSourceItem(achievementId: achievementId)
    }
    
    func updateAchievement(updatedAchievement: Achievement) {
        currentViewController?.updateAchievement(updatedAchievement: updatedAchievement)
    }
    
    func achievementDidPosted(newAchievement: Achievement) {
        currentViewController?.postedAchievement(newAchievement: newAchievement)
    }
    
    func blockingAchievementMenuDidClicked(achievementId: Int) {
        currentViewController?.blockedAchievement(achievementId)
    }
    
    func blockingUserMenuDidClicked(userCode: String) {
        currentViewController?.blockedUser(userCode)
    }
}

// MARK: - CaptureCoordinatorDelegate
extension GroupHomeCoordinator: CaptureCoordinatorDelegate { }
