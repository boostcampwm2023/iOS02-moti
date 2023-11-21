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
    private var currentViewController: CaptureViewController?
    
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
        
        currentViewController = captureVC
        
        changeToCaptureMode()
        
        let navVC = UINavigationController(rootViewController: captureVC)
        navVC.modalPresentationStyle = .fullScreen
        navigationController.present(navVC, animated: true)
    }
    
    private func changeToCaptureMode() {
        guard let currentViewController = currentViewController else { return }
        currentViewController.navigationItem.leftBarButtonItem = UIBarButtonItem(
            title: "취소", style: .plain, target: self,
            action: #selector(cancelButtonAction)
        )
        
        currentViewController.navigationItem.rightBarButtonItem = nil
    }
    
    private func changeToEditMode() {
        guard let currentViewController = currentViewController else { return }
        currentViewController.navigationItem.leftBarButtonItem = UIBarButtonItem(
            title: "다시 촬영", style: .plain, target: self,
            action: #selector(recaptureButtonAction)
        )
        
        currentViewController.navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .done,
            target: self,
            action: #selector(doneButtonAction)
        )
    }
    
    @objc func cancelButtonAction() {
        finish()
    }
    
    @objc func recaptureButtonAction() {
        changeToCaptureMode()
        currentViewController?.startCapture()
    }
    
    @objc func doneButtonAction() {
        finish()
    }
    
    func finish(animated: Bool = true) {
        parentCoordinator?.dismiss(child: self, animated: true)
    }
}

extension CaptureCoordinator: CaptureViewControllerDelegate {
    func didCapture() {
        changeToEditMode()
    }
}
