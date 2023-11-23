//
//  EditAchievementCoordinator.swift
//  
//
//  Created by 유정주 on 11/23/23.
//

import UIKit
import Core
import Data

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
    
    func startAfterCapture(image: UIImage) {
        let editAchievementVM = EditAchievementViewModel(
            fetchCategoryListUseCase: .init(repository: CategoryListRepository())
        )
        let editAchievementVC = EditAchievementViewController(
            viewModel: editAchievementVM,
            image: image
        )
        editAchievementVC.coordinator = self
        
        editAchievementVC.navigationItem.leftBarButtonItem = UIBarButtonItem(
            title: "다시 촬영", style: .plain, target: self,
            action: #selector(recaptureButtonAction)
        )
        
        editAchievementVC.navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .done,
            target: self,
            action: #selector(doneButtonAction)
        )
        
        navigationController.pushViewController(editAchievementVC, animated: true)
        navigationController.setNavigationBarHidden(false, animated: false)
    }
    
    @objc func recaptureButtonAction() {
        finish(animated: false)
    }
    
    @objc func doneButtonAction() {
        navigationController.setNavigationBarHidden(true, animated: false)
        finish(animated: false)
        parentCoordinator?.finish(animated: true)
    }
}
