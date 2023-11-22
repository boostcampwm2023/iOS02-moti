//
//  HomeCoordinator.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Core
import Data

public final class HomeCoordinator: Coordinator {
    public let parentCoordinator: Coordinator?
    public var childCoordinators: [Core.Coordinator] = []
    public let navigationController: UINavigationController
    
    public init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    public func start() {
        let homeVM = HomeViewModel(
            fetchAchievementListUseCase: .init(repository: AchievementListRepository()),
            fetchCategoryListUseCase: .init(repository: CategoryListRepository()), 
            addCategoryUseCase: .init(repository: CategoryListRepository())
        )
        let homeVC = HomeViewController(viewModel: homeVM)
        homeVC.coordinator = self
        navigationController.viewControllers = [homeVC]
    }
    
    public func moveToDetailAchievementViewController() {
        let detailAchievementCoordinator = DetailAchievementCoordinator(navigationController, self)
        childCoordinators.append(detailAchievementCoordinator)
        detailAchievementCoordinator.start()
    }
}
