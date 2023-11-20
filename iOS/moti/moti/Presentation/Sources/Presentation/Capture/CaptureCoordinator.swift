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
        captureVC.delegate = self
        captureVC.coordinator = self
        
        captureVC.navigationItem.leftBarButtonItem = UIBarButtonItem(
            title: "취소", style: .plain, target: self,
            action: #selector(cancelButtonAction)
        )
        
        navigationController.isNavigationBarHidden = false
        navigationController.pushViewController(captureVC, animated: true)
    }
    
    private func moveCaptureResultViewController(imageData: Data) {
        let captureResultCoordinator = CaptureResultCoordinator(navigationController, self)
        captureResultCoordinator.start(resultImageData: imageData)
        childCoordinators.append(captureResultCoordinator)
    }
    
    @objc func cancelButtonAction() {
        navigationController.isNavigationBarHidden = true
        finish()
    }
}

extension CaptureCoordinator: CaptureViewControllerDelegate {
    func didCapture(imageData: Data) {
        moveCaptureResultViewController(imageData: imageData)
    }
}
