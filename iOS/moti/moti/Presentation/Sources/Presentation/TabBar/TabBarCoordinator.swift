//
//  TabBarCoordinator.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Design
import Core

public final class TabBarCoordinator: Coordinator {
    enum TabItemType: CaseIterable {
        case individual, capture, group
        
        var title: String {
            switch self {
            case .individual: return "개인"
            case .capture: return ""
            case .group: return "그룹"
            }
        }
    }
    
    public var childCoordinators: [Coordinator] = []
    public let navigationController: UINavigationController
    private let tabBarController: TabBarViewController
    
    public init(navigationController: UINavigationController) {
        self.navigationController = navigationController
        tabBarController = TabBarViewController()
        tabBarController.tabBarDelegate = self
    }
    
    public func start() {
        configureTabBarControllers(with: [
            makeIndividualTabPage(),
            makeGroupTabPage()
        ])
        
        navigationController.viewControllers = [tabBarController]
    }

    // TabBar VC 설정
    private func configureTabBarControllers(with viewControllers: [UIViewController]) {
        tabBarController.setupViewControllers(with: viewControllers)
    }
  
    private func moveCaptureViewController() {
        let captureCoordinator = CaptureCoordinator(navigationController: navigationController)
        captureCoordinator.start()
        childCoordinators.append(captureCoordinator)
    }
}

// MARK: - Make Child ViewControllers
private extension TabBarCoordinator {
    func makeIndividualTabPage() -> UINavigationController {
        let homeVC = HomeViewController()
        
        homeVC.tabBarItem.image = SymbolImage.individualTabItem
        homeVC.tabBarItem.title = TabItemType.individual.title
        
        return UINavigationController(rootViewController: homeVC)
    }
    
    func makeGroupTabPage() -> UINavigationController {
        let groupListVC = GroupListViewController()
        
        groupListVC.tabBarItem.image = SymbolImage.groupTabItem
        groupListVC.tabBarItem.title = TabItemType.group.title
        
        return UINavigationController(rootViewController: groupListVC)
    }
}

extension TabBarCoordinator: TabBarViewControllerDelegate {
    func captureButtonDidClicked() {
        moveCaptureViewController()
    }
}