//
//  GroupDetailAchievementCoordinator.swift
//  
//
//  Created by 유정주 on 12/3/23.
//

import UIKit
import Core
import Domain
import Data

protocol GroupDetailAchievementCoordinatorDelegate: DetailAchievementCoordinatorDelegate {
    func blockingAchievementMenuDidClicked(achievementId: Int)
    func blockingUserMenuDidClicked(userCode: String)
}

final class GroupDetailAchievementCoordinator: Coordinator {
    var parentCoordinator: Coordinator?
    var childCoordinators: [Coordinator] = []
    var navigationController: UINavigationController
    weak var delegate: GroupDetailAchievementCoordinatorDelegate?
    private var currentViewController: GroupDetailAchievementViewController?

    private let group: Group?

    init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
        self.group = nil
    }
    
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
    
    func start(achievement: Achievement) {
        guard let group else { return }
        
        let blockingRepository = BlockingRepository(groupId: group.id)
        let achievementRepository = GroupAchievementRepository(groupId: group.id)
        let groupDetailAchievementVM = GroupDetailAchievementViewModel(
            fetchDetailAchievementUseCase: .init(repository: achievementRepository),
            deleteAchievementUseCase: .init(repository: achievementRepository, storage: nil),
            blockingUserUseCase: .init(blockingRepository: blockingRepository),
            blockingAchievementUseCase: .init(blockingRepository: blockingRepository),
            achievement: achievement,
            group: group
        )
        let groupDetailAchievementVC = GroupDetailAchievementViewController(viewModel: groupDetailAchievementVM)
        groupDetailAchievementVC.coordinator = self
        groupDetailAchievementVC.delegate = self
        currentViewController = groupDetailAchievementVC
        navigationController.pushViewController(groupDetailAchievementVC, animated: true)
    }
    
    private func moveEditAchievementViewController(achievement: Achievement) {
        guard let group else { return }
        
        let editAchievementCoordinator = EditAchievementCoordinator(navigationController, self)
        editAchievementCoordinator.delegate = self
        editAchievementCoordinator.start(achievement: achievement, group: group)
        childCoordinators.append(editAchievementCoordinator)
    }
}

extension GroupDetailAchievementCoordinator: GroupDetailAchievementViewControllerDelegate {
    func editButtonDidClicked(achievement: Achievement) {
        moveEditAchievementViewController(achievement: achievement)
    }
    
    func deleteButtonDidClicked(achievementId: Int) {
        finish(animated: true)
        delegate?.deleteButtonDidClicked(achievementId: achievementId)
    }
    
    func blockingAchievementMenuDidClicked(achievementId: Int) {
        // TODO: VC에서 achievement 데이터 필터링하기
        delegate?.blockingAchievementMenuDidClicked(achievementId: achievementId)
        finish(animated: true)
    }
    
    func blockingUserMenuDidClicked(userCode: String) {
        // TODO: VC에서 user 관련 데이터 필터링하기
        delegate?.blockingUserMenuDidClicked(userCode: userCode)
        finish(animated: true)
    }
}

extension GroupDetailAchievementCoordinator: EditAchievementCoordinatorDelegate {
    func doneButtonDidClicked(achievement: Achievement) {
        currentViewController?.update(updatedAchievement: achievement)
        delegate?.updateAchievement(updatedAchievement: achievement)
    }
}
