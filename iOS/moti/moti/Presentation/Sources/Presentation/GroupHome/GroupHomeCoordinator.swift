//
//  GroupHomeCoordinator.swift
//  
//
//  Created by 유정주 on 11/30/23.
//

import UIKit
import Core
import Domain

public final class GroupHomeCoordinator: Coordinator {
    public let parentCoordinator: Coordinator?
    public var childCoordinators: [Coordinator] = []
    public let navigationController: UINavigationController
    private var currentViewController: GroupHomeViewController?
        
    public init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    public func start() {
        let groupHomeVM = GroupHomeViewModel()
        let groupHomeVC = GroupHomeViewController(viewModel: groupHomeVM)
        groupHomeVC.coordinator = self
        currentViewController = groupHomeVC
        navigationController.pushViewController(groupHomeVC, animated: true)
    }
}
