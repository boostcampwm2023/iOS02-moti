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
    private var homeViewController: HomeViewController?
    
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
        let homeVM = HomeViewModel(
            fetchAchievementListUseCase: .init(repository: AchievementRepository()),
            fetchCategoryListUseCase: .init(repository: CategoryListRepository()),
            addCategoryUseCase: .init(repository: CategoryListRepository())
        )
        let homeVC = HomeViewController(viewModel: homeVM)
        homeViewController = homeVC
        
        homeVC.tabBarItem.image = SymbolImage.individualTabItem
        homeVC.tabBarItem.title = TabItemType.individual.title
        setupIndividualHomeNavigationBar(viewController: homeVC)
        
        let navVC = UINavigationController(rootViewController: homeVC)
        
        let homeCoordinator = HomeCoordinator(navVC, self)
        homeCoordinator.delegate = self
        homeVC.coordinator = homeCoordinator
        childCoordinators.append(homeCoordinator)
        return navVC
    }
    
    func makeGroupTabPage() -> UINavigationController {
        let groupVM = GroupListViewModel()
        let groupListVC = GroupListViewController(viewModel: groupVM)
        
        groupListVC.tabBarItem.image = SymbolImage.groupTabItem
        groupListVC.tabBarItem.title = TabItemType.group.title
        
        let navVC = UINavigationController(rootViewController: groupListVC)
        
        let groupListCoordinator = GroupListCoordinator(navVC, self)
        groupListVC.coordinator = groupListCoordinator
        childCoordinators.append(groupListCoordinator)
        return navVC
    }
    
    func setupIndividualHomeNavigationBar(viewController: UIViewController) {
        let logoItem = UIImageView(image: MotiImage.logoBlue)
        logoItem.contentMode = .scaleAspectFit
        let leftItem = UIBarButtonItem(customView: logoItem)
        leftItem.customView?.atl
            .width(constant: 60)
        viewController.navigationItem.leftBarButtonItem = leftItem

        // 오른쪽 프로필 버튼
        let profileImage = UIImage(
            systemName: "person.crop.circle.fill",
            withConfiguration: UIImage.SymbolConfiguration(font: .large)
        )
        let profileButton = UIButton(type: .system)
        profileButton.setImage(profileImage, for: .normal)
        profileButton.contentMode = .scaleAspectFit
        profileButton.tintColor = .primaryDarkGray
        let profileItem = UIBarButtonItem(customView: profileButton)

        // 오른쪽 더보기 버튼
        let moreItem = UIBarButtonItem(
            image: SymbolImage.ellipsisCircle,
            style: .done,
            target: self,
            action: nil
        )

        viewController.navigationItem.rightBarButtonItems = [profileItem, moreItem]
    }
    
}

extension TabBarCoordinator: TabBarViewControllerDelegate {
    func captureButtonDidClicked() {
        moveCaptureViewController()
    }
}

extension TabBarCoordinator: HomeCoordinatorDelegate {
    func deleteAction(achievementId: Int) {
        homeViewController?.delete(achievementId: achievementId)
    }
    
    func updateAchievement(id: Int, newCategoryId: Int) {
        homeViewController?.updateAchievement(id: id, newCategoryId: newCategoryId)
    }
}
