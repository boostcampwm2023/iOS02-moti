//
//  AppInfoCoordinator.swift
//
//
//  Created by 유정주 on 12/2/23.
//

import UIKit
import Core
import Domain

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
        let appInfoVC = AppInfoViewController(version: version)
        appInfoVC.coordinator = self
        navigationController.pushViewController(appInfoVC, animated: true)
    }
}
