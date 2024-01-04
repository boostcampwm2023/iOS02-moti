//
//  BlockUserCoordinator.swift
//
//
//  Created by Kihyun Lee on 12/29/23.
//

import UIKit
import Core
import Domain
import Data

protocol BlockedUserListCoordinatorDelegate: AnyObject {
    func unblockUserIsSuccess()
}

final class BlockedUserListCoordinator: Coordinator {
    var parentCoordinator: Coordinator?
    var childCoordinators: [Coordinator] = []
    var navigationController: UINavigationController
    weak var delegate: BlockedUserListCoordinatorDelegate?
    
    init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    func start() { }
    
    func start(group: Group) {
        let blockingRepository = BlockingRepository(groupId: group.id)
        let blockedUserListVM = BlockedUserListViewModel(
            fetchBlockedUserListUseCase: .init(blockingRepository: blockingRepository),
            unblockUserUseCase: .init(blockingRepository: blockingRepository)
        )
        let blockedUserListVC = BlockedUserListViewController(viewModel: blockedUserListVM)
        blockedUserListVC.coordinator = self
        navigationController.pushViewController(blockedUserListVC, animated: true)
    }
}
