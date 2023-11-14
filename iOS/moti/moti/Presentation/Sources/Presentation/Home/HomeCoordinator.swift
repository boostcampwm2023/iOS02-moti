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
    public var childCoordinators: [Core.Coordinator] = []
    public let navigationController: UINavigationController
    
    public init(navigationController: UINavigationController) {
        self.navigationController = navigationController
    }
    
    public func start() {
        let recordListVM = RecordListViewModel(fetchRecordListUseCase: .init(repository: MockRecordListRepository()))
        let homeVC = HomeViewController(viewModel: recordListVM)
        navigationController.viewControllers = [homeVC]
    }
}
