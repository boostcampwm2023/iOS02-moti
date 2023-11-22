//
//  DetailAchievementCoordinator.swift
//
//
//  Created by Kihyun Lee on 11/22/23.
//

import UIKit
import Core

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
        let detailAchievementVC = DetailAchievementViewController()
        detailAchievementVC.coordinator = self
        
        detailAchievementVC.navigationItem.rightBarButtonItems = [
            UIBarButtonItem(title: "편집", style: .plain, target: self, action: nil),
            UIBarButtonItem(title: "삭제", style: .plain, target: self, action: nil)
        ]
        
        detailAchievementVC.navigationItem.rightBarButtonItem = UIBarButtonItem(title: "편집", style: .plain, target: self, action: nil)
        
        navigationController.pushViewController(detailAchievementVC, animated: true)
    }
}
