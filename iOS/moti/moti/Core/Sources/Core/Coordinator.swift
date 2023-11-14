//
//  CoordinatorProtocol.swift
//  moti
//
//  Created by 유정주 on 11/13/23.
//

import UIKit

public protocol Coordinator: AnyObject {
    var parentCoordinator: Coordinator? { get }
    var childCoordinators: [Coordinator] { get set }
    var navigationController: UINavigationController { get }
    
    init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    )

    func start()
    func pop(child: Coordinator?, animated: Bool)
    func dismiss(child: Coordinator?, animated: Bool)
}

public extension Coordinator {
    func pop(child: Coordinator?, animated: Bool = true) {
        childCoordinators = childCoordinators.filter { $0 !== child }
        navigationController.popViewController(animated: animated)
    }
    
    func dismiss(child: Coordinator?, animated: Bool = true) {
        childCoordinators = childCoordinators.filter { $0 !== child }
        navigationController.dismiss(animated: animated)
    }
}
