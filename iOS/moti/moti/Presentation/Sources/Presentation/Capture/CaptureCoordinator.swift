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
    
    func start() { }
    
    func start(currentCategoryId: Int?) { 
        let captureVC = CaptureViewController(group: group, currentCategoryId: currentCategoryId)
        captureVC.delegate = self
        captureVC.coordinator = self
        navigationController.pushViewController(captureVC, animated: true)
    }
    
    private func moveEditAchievementViewConrtoller(image: UIImage, currentCategoryId: Int?) {
        let editAchievementCoordinator = EditAchievementCoordinator(navigationController, self)
        editAchievementCoordinator.delegate = self
        editAchievementCoordinator.startAfterCapture(image: image, group: group, currentCategoryId: currentCategoryId)
        childCoordinators.append(editAchievementCoordinator)
    }
}

extension CaptureCoordinator: CaptureViewControllerDelegate {
    func didCapture(image: UIImage, currentCategoryId: Int?) {
        Logger.debug("캡처 이미지 최종 크기: \(image.size)")
        moveEditAchievementViewConrtoller(image: image, currentCategoryId: currentCategoryId)
    }
}

extension CaptureCoordinator: EditAchievementCoordinatorDelegate {
    func doneButtonDidClicked(achievement: Achievement) {
        delegate?.achievementDidPosted(newAchievement: achievement)
    }
}
