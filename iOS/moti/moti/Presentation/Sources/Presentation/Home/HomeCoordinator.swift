//
//  HomeCoordinator.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Core

public final class HomeCoordinator: Coordinator {
    public var childCoordinators: [Core.Coordinator] = []
    public let navigationController: UINavigationController
    
    public init(navigationController: UINavigationController) {
        self.navigationController = navigationController
    }
    
    public func start() {
        let homeVC = HomeViewController()
        navigationController.viewControllers = [homeVC]
    }
}
