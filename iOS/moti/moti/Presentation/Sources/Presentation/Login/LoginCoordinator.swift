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

public protocol LoginCoordinatorDelegate: AnyObject {
    func finishLogin()
}

public final class LoginCoordinator: Coordinator {
    public weak var delegate: LoginCoordinatorDelegate?
    
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
        let loginUseCase = LoginUseCase(repository: AuthRepository(), keychainStorage: KeychainStorage.shared)
        let loginVM = LoginViewModel(loginUseCase: loginUseCase)
        let loginVC = LoginViewController(viewModel: loginVM)
        loginVC.coordinator = self
        loginVC.delegate = self
        
        navigationController.viewControllers = [loginVC]
    }
    
    public func startWithAlert(message: String) {
        let loginUseCase = LoginUseCase(repository: AuthRepository(), keychainStorage: KeychainStorage.shared)
        let loginVM = LoginViewModel(loginUseCase: loginUseCase)
        let loginVC = LoginViewController(viewModel: loginVM, alertMessage: message)
        loginVC.coordinator = self
        loginVC.delegate = self
        
        navigationController.viewControllers = [loginVC]
    }
}

extension LoginCoordinator: LoginViewControllerDelegate {
    func didLogin() {
        delegate?.finishLogin()
    }
}
