//
//  HomeCoordinator.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Core
import Data
import Domain
import Design

public final class HomeCoordinator: Coordinator {
    public let parentCoordinator: Coordinator?
    public var childCoordinators: [Coordinator] = []
    public let navigationController: UINavigationController
    private var currentViewController: HomeViewController?
        
    public init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    public func start() {
        let homeVM = HomeViewModel(
            fetchAchievementListUseCase: .init(repository: AchievementRepository()),
            fetchCategoryListUseCase: .init(repository: CategoryListRepository()), 
            addCategoryUseCase: .init(repository: CategoryListRepository())
        )
        let homeVC = HomeViewController(viewModel: homeVM)
        homeVC.coordinator = self
        currentViewController = homeVC
        navigationController.viewControllers = [homeVC]
    }
    
    public func moveToDetailAchievementViewController(achievement: Achievement) {
        let detailAchievementCoordinator = DetailAchievementCoordinator(navigationController, self)
        detailAchievementCoordinator.delegate = self
        childCoordinators.append(detailAchievementCoordinator)
        detailAchievementCoordinator.start(achievement: achievement)
    }
}

extension HomeCoordinator: DetailAchievementCoordinatorDelegate {
    func deleteButtonDidClicked(achievementId: Int) {
        currentViewController?.deleteAchievementDataSourceItem(achievementId: achievementId)
    }
    
    func updateAchievement(updatedAchievement: Achievement) {
        currentViewController?.updateAchievement(updatedAchievement: updatedAchievement)
    }
    
    func achievementDidPosted(newAchievement: Achievement) {
        currentViewController?.achievementDidPosted(newAchievement: newAchievement)
    }
}
