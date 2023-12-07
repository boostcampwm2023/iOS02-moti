//
//  AppCoordinator.swift
//  moti
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Presentation
import Core
import Domain

final class AppCoordinator: Coordinator {
    let parentCoordinator: Coordinator?
    var childCoordinators: [Coordinator] = []
    let navigationController: UINavigationController
    
    init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    func start() {
        moveLaunchViewController()
    }
    
    func startWhenExpiredAccessToken() {
        moveLoginViewControllerWhenExpiredAccessToken()
    }
    
    func startWhenLogout() {
        moveLoginViewController()
    }
    
    private func moveLaunchViewController() {
        let launchCoordinator = LaunchCoodinator(navigationController, self)
        launchCoordinator.delegate = self
        start(coordinator: launchCoordinator)
    }
    
    private func moveLoginViewController() {
        let loginCoordinator = LoginCoordinator(navigationController, self)
        loginCoordinator.delegate = self
        start(coordinator: loginCoordinator)
    }
    
    private func moveLoginViewControllerWhenExpiredAccessToken() {
        let loginCoordinator = LoginCoordinator(navigationController, self)
        loginCoordinator.delegate = self
        loginCoordinator.startWithAlert(message: "토큰이 만료되었습니다.\n다시 로그인 해주세요.")
        childCoordinators.append(loginCoordinator)
    }
    
    private func moveHomeViewController() {
        let homeCoordinator = TabBarCoordinator(navigationController, self)
        start(coordinator: homeCoordinator)
    }
    
    private func start(coordinator: Coordinator) {
        coordinator.start()
        childCoordinators.append(coordinator)
    }
}

extension AppCoordinator: LaunchCoodinatorDelegate {
    func successAutoLogin(_ coordinator: LaunchCoodinator) {
        moveHomeViewController()
    }
    
    func failedAutoLogin(_ coordinator: LaunchCoodinator) {
        moveLoginViewController()
    }
}

extension AppCoordinator: LoginCoordinatorDelegate {
    func finishLogin() {
        Logger.info("Success Login. 홈 화면으로 이동")
        moveHomeViewController()
    }
}
