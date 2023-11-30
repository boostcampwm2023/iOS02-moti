//
//  CaptureCoordinator.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Core
import Domain

protocol CaptureCoordinatorDelegate: AnyObject {
    func achievementDidPosted(newAchievement: Achievement)
}

final class CaptureCoordinator: Coordinator {
    var parentCoordinator: Coordinator?
    var childCoordinators: [Coordinator] = []
    var navigationController: UINavigationController
    private var currentNavigationController: UINavigationController?
    weak var delegate: CaptureCoordinatorDelegate?
    
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
        
        captureVC.navigationItem.rightBarButtonItem = nil
        
        navigationController.pushViewController(captureVC, animated: true)
        navigationController.setNavigationBarHidden(false, animated: false)
    }
    
    private func moveEditAchievementViewConrtoller(image: UIImage) {
        let editAchievementCoordinator = EditAchievementCoordinator(navigationController, self)
        editAchievementCoordinator.delegate = self
        editAchievementCoordinator.startAfterCapture(image: image)
        childCoordinators.append(editAchievementCoordinator)
    }
    
    @objc func cancelButtonAction() {
        navigationController.setNavigationBarHidden(true, animated: false)
        finish()
    }
}

extension CaptureCoordinator: CaptureViewControllerDelegate {
    func didCapture(image: UIImage) {
        moveEditAchievementViewConrtoller(image: image)
    }
}

extension CaptureCoordinator: EditAchievementCoordinatorDelegate {
    func doneButtonDidClickedFromDetail(updatedAchievement: Achievement) {
        
    }
    
    func doneButtonDidClickedFromCapture(newAchievement: Achievement) {
        delegate?.achievementDidPosted(newAchievement: newAchievement)
    }
}
