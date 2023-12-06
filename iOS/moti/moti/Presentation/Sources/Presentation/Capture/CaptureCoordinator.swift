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
    
    private let group: Group?
    
    init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
        self.group = nil
    }
    
    // 프로토콜 요구사항 때문에 따로 정의
    init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?,
        group: Group
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
        self.group = group
    }
    
    func start() { 
        let captureVC = CaptureViewController(group: group)
        captureVC.delegate = self
        captureVC.coordinator = self
        
        captureVC.navigationItem.leftBarButtonItem = UIBarButtonItem(
            title: "취소", style: .plain, target: self,
            action: #selector(cancelButtonAction)
        )
        
        captureVC.navigationItem.rightBarButtonItem = nil
        
        navigationController.pushViewController(captureVC, animated: true)
    }
    
    private func moveEditAchievementViewConrtoller(image: UIImage) {
        let editAchievementCoordinator = EditAchievementCoordinator(navigationController, self)
        editAchievementCoordinator.delegate = self
        editAchievementCoordinator.startAfterCapture(image: image, group: group)
        childCoordinators.append(editAchievementCoordinator)
    }
    
    @objc func cancelButtonAction() {
        finish()
    }
}

extension CaptureCoordinator: CaptureViewControllerDelegate {
    func didCapture(image: UIImage) {
        moveEditAchievementViewConrtoller(image: image)
    }
}

extension CaptureCoordinator: EditAchievementCoordinatorDelegate {
    func doneButtonDidClicked(achievement: Achievement) {
        delegate?.achievementDidPosted(newAchievement: achievement)
    }
}
