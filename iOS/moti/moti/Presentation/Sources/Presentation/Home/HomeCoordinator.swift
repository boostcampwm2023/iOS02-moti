//
//  HomeCoordinator.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Core
import Data
import Domain
import Design

public final class HomeCoordinator: Coordinator {
    public let parentCoordinator: Coordinator?
    public var childCoordinators: [Coordinator] = []
    public let navigationController: UINavigationController
    private var currentViewController: HomeViewController?
        
    public init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    public func start() {
        let achievementRepository = AchievementRepository()
        let categoryRepository = CategoryRepository()
        let homeVM = HomeViewModel(
            fetchAchievementListUseCase: .init(repository: achievementRepository),
            fetchCategoryUseCase: .init(repository: categoryRepository),
            fetchCategoryListUseCase: .init(repository: categoryRepository),
            addCategoryUseCase: .init(repository: categoryRepository),
            deleteAchievementUseCase: .init(repository: achievementRepository),
            fetchDetailAchievementUseCase: .init(repository: achievementRepository)
        )
        let homeVC = HomeViewController(viewModel: homeVM)
        homeVC.coordinator = self
        homeVC.delegate = self
        currentViewController = homeVC
        navigationController.viewControllers = [homeVC]
    }
    
    func moveToDetailAchievementViewController(achievement: Achievement) {
        let detailAchievementCoordinator = DetailAchievementCoordinator(navigationController, self)
        detailAchievementCoordinator.delegate = self
        childCoordinators.append(detailAchievementCoordinator)
        detailAchievementCoordinator.start(achievement: achievement)
    }
    
    func moveToEditAchievementViewController(achievement: Achievement) {
        let editAchievementCoordinator = EditAchievementCoordinator(navigationController, self)
        editAchievementCoordinator.delegate = self
        childCoordinators.append(editAchievementCoordinator)
        editAchievementCoordinator.start(achievement: achievement)
    }
    
    func moveToAppInfoViewController() {
        let appInfoCoordinator = AppInfoCoordinator(navigationController, self)
        childCoordinators.append(appInfoCoordinator)
        appInfoCoordinator.start()
    }
    
    func moveToManageCategoryViewController(categories: [CategoryItem]) {
        let manageCategoryCoordinator = ManageCategoryCoordinator(navigationController, self)
        manageCategoryCoordinator.delegate = self
        childCoordinators.append(manageCategoryCoordinator)
        manageCategoryCoordinator.start(categories: categories)
    }
    
    func moveToCaptureViewController(currentCategoryId: Int?) {
        let captureCoordinator = CaptureCoordinator(navigationController, self)
        captureCoordinator.delegate = self
        captureCoordinator.start(currentCategoryId: currentCategoryId)
        childCoordinators.append(captureCoordinator)
    }
}

extension HomeCoordinator: HomeViewControllerDelegate {
    func editMenuDidClicked(achievement: Achievement) {
        moveToEditAchievementViewController(achievement: achievement)
    }
}

// MARK: - DetailAchievementCoordinatorDelegate
extension HomeCoordinator: DetailAchievementCoordinatorDelegate {
    func deleteButtonDidClicked(achievementId: Int) {
        currentViewController?.deleteAchievementDataSourceItem(achievementId: achievementId)
    }
    
    func updateAchievement(updatedAchievement: Achievement) {
        currentViewController?.updateAchievement(updatedAchievement: updatedAchievement)
    }
    
    func achievementDidPosted(newAchievement: Achievement) {
        currentViewController?.achievementDidPosted(newAchievement: newAchievement)
    }
}

// MARK: - EditAchievementCoordinatorDelegate
extension HomeCoordinator: EditAchievementCoordinatorDelegate {
    func doneButtonDidClicked(achievement: Achievement) {
        currentViewController?.updateAchievement(updatedAchievement: achievement)
    }
}

// MARK: - CaptureCoordinatorDelegate
extension HomeCoordinator: CaptureCoordinatorDelegate { }

// MARK: - ManageCategoryCoordinatorDelegate
extension HomeCoordinator: ManageCategoryCoordinatorDelegate {
    func doneButtonDidClicked() {
        currentViewController?.fetchCategoryList()
    }
}
