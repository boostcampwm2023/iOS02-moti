//
//  ManageCategoryCoordinator.swift
//
//
//  Created by Kihyun Lee on 12/25/23.
//

import UIKit
import Core
import Domain
import Data

final class ManageCategoryCoordinator: Coordinator {
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
    
    func start(categories: [CategoryItem]) {
        let manageCategoryVM = ManageCategoryViewModel(
            categories: categories
        )
        let manageCategoryVC = ManageCategoryViewController(viewModel: manageCategoryVM)
        manageCategoryVC.coordinator = self
        manageCategoryVC.delegate = self
        let navVC = UINavigationController(rootViewController: manageCategoryVC)
        navigationController.present(navVC, animated: true)
    }
}

extension ManageCategoryCoordinator: ManageCategoryViewControllerDelegate {
    func cancelButtonDidClicked() {
        parentCoordinator?.dismiss(child: self, animated: true)
    }
    
    func doneButtonDidClicked() {
        parentCoordinator?.dismiss(child: self, animated: true)
    }
}
