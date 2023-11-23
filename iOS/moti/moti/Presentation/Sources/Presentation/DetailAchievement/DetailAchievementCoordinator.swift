//
//  DetailAchievementCoordinator.swift
//
//
//  Created by Kihyun Lee on 11/22/23.
//

import UIKit
import Core
import Data

public final class DetailAchievementCoordinator: Coordinator {
    public var parentCoordinator: Coordinator?
    public var childCoordinators: [Coordinator] = []
    public var navigationController: UINavigationController
    
    public init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    public func start() {
        
    }
    
    public func start(achievementId: Int) {
        let detailAchievementVC = DetailAchievementViewController(
            viewModel: DetailAchievementViewModel(
                fetchDetailAchievementUseCase: .init(repository: DetailAchievementRepository()),
                achievementId: achievementId)
        )
        detailAchievementVC.coordinator = self
        navigationController.pushViewController(detailAchievementVC, animated: true)
    }
}
