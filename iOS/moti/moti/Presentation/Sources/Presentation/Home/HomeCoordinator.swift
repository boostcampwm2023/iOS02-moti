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

protocol HomeCoordinatorDelegate: AnyObject {
    func deleteAction(achievementId: Int)
    func updateAchievement(id: Int, newCategoryId: Int)
}

public final class HomeCoordinator: Coordinator {
    public let parentCoordinator: Coordinator?
    public var childCoordinators: [Core.Coordinator] = []
    public let navigationController: UINavigationController
    weak var delegate: HomeCoordinatorDelegate?
    
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
        delegate?.deleteAction(achievementId: achievementId)
    }
    
    func updateAchievement(id: Int, newCategoryId: Int) {
        delegate?.updateAchievement(id: id, newCategoryId: newCategoryId)
    }
}
