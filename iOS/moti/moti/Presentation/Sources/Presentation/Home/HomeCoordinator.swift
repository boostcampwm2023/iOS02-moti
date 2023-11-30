//
//  HomeCoordinator.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Core
import Data
import Domain
import Design

public final class HomeCoordinator: Coordinator {
    public let parentCoordinator: Coordinator?
    public var childCoordinators: [Core.Coordinator] = []
    public let navigationController: UINavigationController
    private var currentViewController: HomeViewController?
        
    public init(
        _ navigationController: UINavigationController,
        _ parentCoordinator: Coordinator?
    ) {
        self.navigationController = navigationController
        self.parentCoordinator = parentCoordinator
    }
    
    public func start() {
        let homeVM = HomeViewModel(
            fetchAchievementListUseCase: .init(repository: AchievementRepository()),
            fetchCategoryListUseCase: .init(repository: CategoryListRepository()), 
            addCategoryUseCase: .init(repository: CategoryListRepository())
        )
        let homeVC = HomeViewController(viewModel: homeVM)
        setupNavigationBar(viewController: homeVC)
        homeVC.coordinator = self
        currentViewController = homeVC
        navigationController.viewControllers = [homeVC]
    }
    
    public func moveToDetailAchievementViewController(achievement: Achievement) {
        let detailAchievementCoordinator = DetailAchievementCoordinator(navigationController, self)
        detailAchievementCoordinator.delegate = self
        childCoordinators.append(detailAchievementCoordinator)
        detailAchievementCoordinator.start(achievement: achievement)
    }
    
    func setupNavigationBar(viewController: UIViewController) {
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

extension HomeCoordinator: DetailAchievementCoordinatorDelegate {
    func deleteButtonAction(achievementId: Int) {
        currentViewController?.delete(achievementId: achievementId)
    }
    
    func updateAchievement(achievementId: Int, newCategoryId: Int) {
        currentViewController?.updateAchievement(achievementId: achievementId, newCategoryId: newCategoryId)
    }
    
    func postAchievement(newAchievement: Achievement) {
        print("-2")
        currentViewController?.postAchievement(newAchievement: newAchievement)
    }
}
