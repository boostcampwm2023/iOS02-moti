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

protocol EditAchievementCoordinatorDelegate: AnyObject {
    func doneButtonDidClickedFromDetail(updateAchievementRequestValue: UpdateAchievementRequestValue)
    func doneButtonDidClickedFromCapture(newAchievement: Achievement)
}

final class EditAchievementCoordinator: Coordinator {
    var parentCoordinator: Coordinator?
    var childCoordinators: [Coordinator] = []
    var navigationController: UINavigationController
    weak var delegate: EditAchievementCoordinatorDelegate?
    
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
            fetchCategoryListUseCase: .init(repository: CategoryListRepository()),
            updateAchievementUseCase: .init(repository: AchievementRepository()), 
            postAchievementUseCase: .init(repository: AchievementRepository())
        )
        let editAchievementVC = EditAchievementViewController(
            viewModel: editAchievementVM,
            achievement: achievement
        )
        editAchievementVC.coordinator = self
        editAchievementVC.delegate = self
        
        editAchievementVC.navigationItem.leftBarButtonItem = UIBarButtonItem(
            title: "취소", style: .plain, target: self,
            action: #selector(cancelButtonAction)
        )
        
        let navVC = UINavigationController(rootViewController: editAchievementVC)
        navigationController.present(navVC, animated: true)
    }
    
    func startAfterCapture(image: UIImage) {
        let editAchievementVM = EditAchievementViewModel(
            saveImageUseCase: .init(repository: ImageRepository()),
            fetchCategoryListUseCase: .init(repository: CategoryListRepository()),
            updateAchievementUseCase: .init(repository: AchievementRepository()),
            postAchievementUseCase: .init(repository: AchievementRepository())
        )
        let editAchievementVC = EditAchievementViewController(
            viewModel: editAchievementVM,
            image: image
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
    
    @objc private func cancelButtonAction() {
        parentCoordinator?.dismiss(child: self, animated: true)
    }
    
    @objc private func recaptureButtonAction() {
        finish(animated: false)
    }
}

extension EditAchievementCoordinator: EditAchievementViewControllerDelegate {
    func doneButtonDidClickedFromDetailView(updateAchievementRequestValue: UpdateAchievementRequestValue) {
        parentCoordinator?.dismiss(child: self, animated: true)
        delegate?.doneButtonDidClickedFromDetail(updateAchievementRequestValue: updateAchievementRequestValue)
    }
    
    func doneButtonDidClickedFromCaptureView(newAchievement: Achievement) {
        delegate?.doneButtonDidClickedFromCapture(newAchievement: newAchievement)
        navigationController.setNavigationBarHidden(true, animated: false)
        finish(animated: false)
        parentCoordinator?.finish(animated: true)
    }
}
