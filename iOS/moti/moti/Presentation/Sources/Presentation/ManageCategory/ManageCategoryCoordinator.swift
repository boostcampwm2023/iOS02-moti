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

protocol ManageCategoryCoordinatorDelegate: AnyObject {
    func doneButtonDidClicked()
}

final class ManageCategoryCoordinator: Coordinator {
    var parentCoordinator: Coordinator?
    var childCoordinators: [Coordinator] = []
    var navigationController: UINavigationController
    weak var delegate: ManageCategoryCoordinatorDelegate?
    
    init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    func start() { }
    
    func start(categories: [CategoryItem]) {
        let categoryRepository = CategoryRepository()
        let manageCategoryVM = ManageCategoryViewModel(
            categories: categories,
            reorderCategoriesUseCase: .init(repository: categoryRepository),
            deleteCategoryUseCase: .init(repository: categoryRepository)
        )
        let manageCategoryVC = ManageCategoryViewController(viewModel: manageCategoryVM)
        manageCategoryVC.coordinator = self
        manageCategoryVC.delegate = self
        let navVC = UINavigationController(rootViewController: manageCategoryVC)
        navigationController.present(navVC, animated: true)
    }
    
    func start(group: Group, categories: [CategoryItem]) {
        let categoryRepository = GroupCategoryRepository(groupId: group.id)
        let manageCategoryVM = ManageCategoryViewModel(
            categories: categories,
            reorderCategoriesUseCase: .init(repository: categoryRepository),
            deleteCategoryUseCase: .init(repository: categoryRepository)
        )
        let manageCategoryVC = ManageCategoryViewController(viewModel: manageCategoryVM)
        manageCategoryVC.coordinator = self
        manageCategoryVC.delegate = self
        let navVC = UINavigationController(rootViewController: manageCategoryVC)
        navigationController.present(navVC, animated: true)
    }
    
    func finish(animated: Bool = true) {
        parentCoordinator?.dismiss(child: self, animated: animated)
    }
}

extension ManageCategoryCoordinator: ManageCategoryViewControllerDelegate {
    func manageCategoryDidCompleted() {
        delegate?.doneButtonDidClicked()
    }
}
