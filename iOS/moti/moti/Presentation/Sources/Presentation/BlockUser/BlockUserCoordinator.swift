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

final class BlockUserCoordinator: Coordinator {
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
    
    func start() { }
    
    func start(group: Group) {
        let blockingRepository = BlockingRepository(groupId: group.id)
        let blockUserVM = BlockUserViewModel(
            fetchBlockedUserListUseCase: .init(blockingRepository: blockingRepository)
        )
        let blockUserVC = BlockUserViewController(viewModel: blockUserVM)
        blockUserVC.coordinator = self
        navigationController.pushViewController(blockUserVC, animated: true)
    }
}
