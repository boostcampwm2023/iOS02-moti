//
//  DetailAchievementCoordinator.swift
//
//
//  Created by Kihyun Lee on 11/22/23.
//

import UIKit
import Core
import Data
import Domain

protocol DetailAchievementCoordinatorDelegate: AnyObject {

    func deleteButtonDidClicked(achievementId: Int)
    func updateAchievement(updatedAchievement: Achievement)
    func achievementDidPosted(newAchievement: Achievement)
}

public final class DetailAchievementCoordinator: Coordinator {

    public var parentCoordinator: Coordinator?
    public var childCoordinators: [Coordinator] = []
    public var navigationController: UINavigationController
    weak var delegate: DetailAchievementCoordinatorDelegate?
    private var detailAchievementViewController: DetailAchievementViewController?
    
    public init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    public func start() { }
    
    public func start(achievement: Achievement) {
        let detailAchievementVC = DetailAchievementViewController(
            viewModel: DetailAchievementViewModel(
                fetchDetailAchievementUseCase: .init(repository: AchievementRepository()),
                deleteAchievementUseCase: .init(repository: AchievementRepository()),
                achievement: achievement
            )
        )
        detailAchievementVC.coordinator = self
        detailAchievementVC.delegate = self
        detailAchievementViewController = detailAchievementVC
        navigationController.pushViewController(detailAchievementVC, animated: true)
    }
    
    private func moveEditAchievementViewController(achievement: Achievement) {
        let editAchievementCoordinator = EditAchievementCoordinator(navigationController, self)
        editAchievementCoordinator.delegate = self
        editAchievementCoordinator.start(achievement: achievement)
        childCoordinators.append(editAchievementCoordinator)
    }
}

extension DetailAchievementCoordinator: DetailAchievementViewControllerDelegate {

    func editButtonDidClicked(achievement: Achievement) {
        moveEditAchievementViewController(achievement: achievement)
    }
    
    func deleteButtonDidClicked(achievementId: Int) {
        finish(animated: true)
        delegate?.deleteButtonDidClicked(achievementId: achievementId)
    }
}

extension DetailAchievementCoordinator: EditAchievementCoordinatorDelegate {

    func doneButtonDidClicked(achievement: Achievement) {
        detailAchievementViewController?.update(updatedAchievement: achievement)
        delegate?.updateAchievement(updatedAchievement: achievement)
    }
}
