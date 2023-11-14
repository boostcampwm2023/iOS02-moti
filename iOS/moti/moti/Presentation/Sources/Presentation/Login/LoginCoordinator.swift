//
//  LoginCoordinator.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Core
import Data
import Domain

public final class LoginCoordinator: Coordinator {
    public let parentCoordinator: Coordinator?
    public var childCoordinators: [Coordinator] = []
    public let navigationController: UINavigationController
    
    public init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    public func start() {
        let loginUseCase = LoginUseCase(repository: MockLoginRepository())
        let loginVM = LoginViewModel(loginUseCase: loginUseCase)
        let loginVC = LoginViewController(viewModel: loginVM)
        navigationController.viewControllers = [loginVC]
    }
}
