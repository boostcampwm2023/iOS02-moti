//
//  EditAchievementCoordinator.swift
//  
//
//  Created by 유정주 on 11/23/23.
//

import UIKit
import Core
import Data
import Domain

final class EditAchievementCoordinator: Coordinator {
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
        
    }
    
    func start(achievement: Achievement) {
        let editAchievementVM = EditAchievementViewModel(
            saveImageUseCase: .init(repository: ImageRepository()),
            fetchCategoryListUseCase: .init(repository: CategoryListRepository())
        )
        let editAchievementVC = EditAchievementViewController(
            viewModel: editAchievementVM,
            achievement: achievement
        )
        editAchievementVC.coordinator = self
        editAchievementVC.delegate = self
        editAchievementVC.navigationItem.hidesBackButton = true
        
        navigationController.pushViewController(editAchievementVC, animated: false)
        navigationController.setNavigationBarHidden(false, animated: false)
    }
    
    func startAfterCapture(image: UIImage, imageExtension: ImageExtension) {
        let editAchievementVM = EditAchievementViewModel(
            saveImageUseCase: .init(repository: ImageRepository()),
            fetchCategoryListUseCase: .init(repository: CategoryListRepository())
        )
        let editAchievementVC = EditAchievementViewController(
            viewModel: editAchievementVM,
            image: image,
            imageExtension: imageExtension
        )
        editAchievementVC.coordinator = self
        editAchievementVC.delegate = self
        
        editAchievementVC.navigationItem.leftBarButtonItem = UIBarButtonItem(
            title: "다시 촬영", style: .plain, target: self,
            action: #selector(recaptureButtonAction)
        )
        
        navigationController.pushViewController(editAchievementVC, animated: false)
        navigationController.setNavigationBarHidden(false, animated: false)
    }
    
    @objc func recaptureButtonAction() {
        finish(animated: false)
    }
}

extension EditAchievementCoordinator: EditAchievementViewControllerDelegate {
    func doneButtonDidClicked(isFromCaptureMode: Bool) {
        if isFromCaptureMode {
            navigationController.setNavigationBarHidden(true, animated: false)
            finish(animated: false)
            parentCoordinator?.finish(animated: true)
        } else {
            navigationController.popViewController(animated: false)
        }
    }
}
