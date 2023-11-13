//
//  CoordinatorProtocol.swift
//  moti
//
//  Created by 유정주 on 11/13/23.
//

import UIKit

public protocol Coordinator: AnyObject {
    var childCoordinators: [Coordinator] { get set }
    var navigationController: UINavigationController { get }
    
    func start()
}
