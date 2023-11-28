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
    
    public func moveToDetailAchievementViewController(achievement: Achievement) {
        let detailAchievementCoordinator = DetailAchievementCoordinator(navigationController, self)
        detailAchievementCoordinator.delegate = self
        childCoordinators.append(detailAchievementCoordinator)
        detailAchievementCoordinator.start(achievement: achievement)
    }
}

extension HomeCoordinator: DetailAchievementCoordinatorDelegate {
    func deleteButtonAction(achievementId: Int) {
        // homeCoordinator에서 만든 homeVC를 따로 저장하고 있지 않기 때문에, naviVC에 접근하여 찾기
        guard let homeVC = navigationController.viewControllers.compactMap({ $0 as? HomeViewController }).first else { return }
        homeVC.delete(achievementId: achievementId)
    }
}
