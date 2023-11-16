//
//  HomeViewController.swift
//  
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Combine
import Core
import Design

final class HomeViewController: BaseViewController<HomeView> {

    // MARK: - Properties
    weak var coordinator: HomeCoordinator?
    private let viewModel: HomeViewModel
    
    init(viewModel: HomeViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupNavigation()
        setupAchievementDataSource()
        setupCategoryDataSource()
        
        try? viewModel.fetchAchievementList()
        viewModel.fetchCategories()
        
        // TODO: 카테고리 리스트 API를 받았을 때 실행시켜야 함. 지금은 임시로 0.1초 후에 실행
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1, execute: {
            self.layoutView.categoryCollectionView.selectItem(at: [0, 0], animated: false, scrollPosition: .init())
            self.collectionView(self.layoutView.categoryCollectionView.self, didSelectItemAt: IndexPath(item: 0, section: 0))
        })
    }
    
    // MARK: - Setup
    private func setupNavigation() {
        // TODO: 코디네이터의 내비게이션을 수정하기 -> 현재는 UI 구현에 집중!
        // 왼쪽 상단 로고
        let logoItem = UIImageView(image: MotiImage.logoBlue)
        logoItem.contentMode = .scaleAspectFit
        let leftItem = UIBarButtonItem(customView: logoItem)
        leftItem.customView?.atl
            .width(constant: 60)
        navigationItem.leftBarButtonItem = leftItem
        
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
        
        navigationItem.rightBarButtonItems = [profileItem, moreItem]
    }
    
    private func setupAchievementDataSource() {
        layoutView.achievementCollectionView.delegate = self
        let dataSource = HomeViewModel.AchievementDataSource.DataSource(
            collectionView: layoutView.achievementCollectionView,
            cellProvider: { collectionView, indexPath, item in
                let cell: AchievementCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                
                if item.id.isEmpty {
                    cell.showSkeleton()
                } else {
                    cell.hideSkeleton()
                    cell.configure(imageURL: item.imageURL)
                }
                
                return cell
            }
        )
        
        dataSource.supplementaryViewProvider = { collecionView, elementKind, indexPath in
            guard elementKind == UICollectionView.elementKindSectionHeader else { return nil }
            
            let headerView = collecionView.dequeueReusableSupplementaryView(
                ofKind: elementKind,
                withReuseIdentifier: HeaderView.identifier,
                for: indexPath) as? HeaderView
            
            headerView?.configure(category: "다이어트", count: "32회", date: "2023-11-03")
            return headerView
        }
        
        let diffableDataSource = HomeViewModel.AchievementDataSource(dataSource: dataSource)
        viewModel.setupAchievementDataSource(diffableDataSource)
    }
    
    private func setupCategoryDataSource() {
        layoutView.categoryCollectionView.delegate = self
        let dataSource = HomeViewModel.CategoryDataSource.DataSource(
            collectionView: layoutView.categoryCollectionView,
            cellProvider: { collectionView, indexPath, item in
                let cell: CategoryCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                cell.configure(with: item)
                return cell
            }
        )
        
        let diffableDataSource = HomeViewModel.CategoryDataSource(dataSource: dataSource)
        viewModel.setupCategoryDataSource(diffableDataSource)
    }
}

extension HomeViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        guard let cell = collectionView.cellForItem(at: indexPath) as? CategoryCollectionViewCell else { return }

        // 눌렸을 때 Bounce 적용
        // Highlight에만 적용하면 Select에서는 적용이 안 되서 별도로 적용함
        UIView.animate(withDuration: 0.08, animations: {
            cell.applyHighlightUI()
            let scale = CGAffineTransform(scaleX: 0.97, y: 0.97)
            cell.transform = scale
        }, completion: { _ in
            cell.transform = .identity
        })
    }
    
    func collectionView(_ collectionView: UICollectionView, didEndDisplaying cell: UICollectionViewCell, forItemAt indexPath: IndexPath) {
        guard let cell = cell as? AchievementCollectionViewCell else { return }
        cell.cancelDownloadImage()
    }
}
