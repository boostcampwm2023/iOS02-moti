//
//  HomeCoordinator.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Core
import Data

public final class HomeCoordinator: Coordinator {
    public let parentCoordinator: Coordinator?
    public var childCoordinators: [Core.Coordinator] = []
    public let navigationController: UINavigationController
    
    public init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    public func start() {
        let recordListVM = RecordListViewModel(fetchRecordListUseCase: .init(repository: MockRecordListRepository()))
        let homeVC = HomeViewController(recordListViewModel: recordListVM)
        homeVC.coordinator = self
        navigationController.viewControllers = [homeVC]
    }
}
