//
//  AppInfoCoordinator.swift
//
//
//  Created by 유정주 on 12/2/23.
//

import UIKit
import Core
import Domain
import Data

final class AppInfoCoordinator: Coordinator {

    var parentCoordinator: Coordinator?
    var childCoordinators: [Coordinator] = []
    var navigationController: UINavigationController
    
    init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    func start() {
        guard let latest = UserDefaults.standard.readString(key: .latestVersion),
              let required = UserDefaults.standard.readString(key: .requiredVersion),
              let privacyPolicy = UserDefaults.standard.readString(key: .privacyPolicy) else { return }
        
        let version = Version(latest: latest, required: required, privacyPolicy: privacyPolicy)
        let revokeUseCase = RevokeUseCase(repository: AuthRepository())
        let appInfoVM = AppInfoViewModel(revokeUseCase: revokeUseCase)
        let appInfoVC = AppInfoViewController(viewModel: appInfoVM, version: version)
        appInfoVC.coordinator = self
        navigationController.present(appInfoVC, animated: true)
    }
    
    func finish(animated: Bool = true) {
        parentCoordinator?.dismiss(child: self, animated: animated)
    }
}
