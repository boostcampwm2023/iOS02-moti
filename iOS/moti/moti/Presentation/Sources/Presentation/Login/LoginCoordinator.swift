//
//  LoginCoordinator.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Core

public final class LoginCoordinator: Coordinator {
    public var childCoordinators: [Coordinator] = []
    public let navigationController: UINavigationController
    
    public init(navigationController: UINavigationController) {
        self.navigationController = navigationController
    }
    
    public func start() {
        let loginVC = LoginViewController()
        navigationController.viewControllers = [loginVC]
    }
}
