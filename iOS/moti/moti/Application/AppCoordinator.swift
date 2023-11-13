//
//  AppCoordinator.swift
//  moti
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Presentation
import Core

final class AppCoordinator: Coordinator {
    var childCoordinators: [Coordinator] = []
    let navigationController: UINavigationController
    
    init(navigationController: UINavigationController) {
        self.navigationController = navigationController
    }
    
    func start() {
        moveLaunchViewController()
    }
    
    func moveLaunchViewController() {
        let launchCoordinator = LaunchCoodinator(navigationController: navigationController)
        launchCoordinator.delegate = self
        start(coordinator: launchCoordinator)
    }
    
    func moveLoginViewController() {
        let loginCoordinator = LoginCoordinator(navigationController: navigationController)
        start(coordinator: loginCoordinator)
    }
    
    func moveHomeViewController() {
        let homeCoordinator = HomeCoordinator(navigationController: navigationController)
        start(coordinator: homeCoordinator)
    }
    
    private func start(coordinator: Coordinator) {
        coordinator.start()
        childCoordinators.append(coordinator)
    }
}

extension AppCoordinator: LaunchCoodinatorDelegate {
    func successAutoLogin(_ coordinator: LaunchCoodinator) {
        childCoordinators = childCoordinators.filter { $0 !== coordinator }
        moveHomeViewController()
    }
    
    func failedAutoLogin(_ coordinator: LaunchCoodinator) {
        childCoordinators = childCoordinators.filter { $0 !== coordinator }
        moveLoginViewController()
    }
}
