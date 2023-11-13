//
//  LaunchCoodinator.swift
//
//
//  Created by 유정주 on 11/10/23.
//

import UIKit
import Core
import Data

public protocol LaunchCoodinatorDelegate: AnyObject {
    func successAutoLogin(_ coordinator: LaunchCoodinator)
    func failedAutoLogin(_ coordinator: LaunchCoodinator)
}

public final class LaunchCoodinator: Coordinator {
    public var childCoordinators: [Coordinator] = []
    public weak var delegate: LaunchCoodinatorDelegate?
    
    public let navigationController: UINavigationController
    
    public init(navigationController: UINavigationController) {
        self.navigationController = navigationController
    }
    
    public func start() {
        let launchVM = LaunchViewModel(fetchVersionUseCase: .init(repository: MockVersionRepository()))
        let launchVC = LaunchViewController(viewModel: launchVM)
        launchVC.delegate = self
        navigationController.viewControllers = [launchVC]
    }
}

extension LaunchCoodinator: LaunchViewControllerDelegate {
    func viewControllerDidLogin(isSuccess: Bool) {
        if isSuccess {
            delegate?.successAutoLogin(self)
        } else {
            delegate?.failedAutoLogin(self)
        }
    }
}
