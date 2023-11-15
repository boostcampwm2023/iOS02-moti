//
//  TabBarCoordinator.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Design
import Core
import Data

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
    
    public let parentCoordinator: Coordinator?
    public var childCoordinators: [Coordinator] = []
    public let navigationController: UINavigationController
    private let tabBarController: TabBarViewController
    
    public init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
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
        let captureCoordinator = CaptureCoordinator(navigationController, self)
        captureCoordinator.start()
        childCoordinators.append(captureCoordinator)
    }
}

// MARK: - Make Child ViewControllers
private extension TabBarCoordinator {
    func makeIndividualTabPage() -> UINavigationController {
        let homeVM = HomeViewModel(fetchAchievementListUseCase: .init(repository: MockAchievementListRepository()))
        let homeVC = HomeViewController(viewModel: homeVM)
        
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
