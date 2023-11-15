//
//  CaptureCoordinator.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Core

final class CaptureCoordinator: Coordinator {
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
        let captureVC = CaptureViewController()
        captureVC.coordinator = self
        
        let navVC = UINavigationController(rootViewController: captureVC)
//        navVC.modalPresentationStyle = .fullScreen
        navigationController.present(navVC, animated: true)
    }
    
    func finish(animated: Bool = true) {
        parentCoordinator?.dismiss(child: self, animated: animated)
    }
}
