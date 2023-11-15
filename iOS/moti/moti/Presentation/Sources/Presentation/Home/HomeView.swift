//
//  HomeView.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit
import Design

final class HomeView: UIView {
    
    // MARK: - Views
    // 카테고리 리스트 컬렉션 뷰
    let categoryCollectionView = {
        let collectionView = UIView()
        collectionView.backgroundColor = .blue
        return collectionView
    }()
    
    // 달성 기록 리스트 컬렉션 뷰
    private(set) lazy var achievementCollectionView: UICollectionView = {
        let collectionView = UICollectionView(frame: .zero, collectionViewLayout: makeAchievementCollectionView())
        collectionView.backgroundColor = .motiBackground
        collectionView.register(with: AchievementCollectionViewCell.self)
        collectionView.register(with: HeaderView.self, elementKind: UICollectionView.elementKindSectionHeader)
        return collectionView
    }()
    
    // MARK: - Init
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    // MARK: - Setup
    private func setupUI() {
        setupCategoryCollectionView()
        setupAchievementCollectionView()
    }
    
    private func setupCategoryCollectionView() {
        addSubview(categoryCollectionView)
        categoryCollectionView.atl
            .width(equalTo: self.widthAnchor)
            .height(constant: 50)
            .top(equalTo: self.safeAreaLayoutGuide.topAnchor)
    }
    
    private func setupAchievementCollectionView() {
        addSubview(achievementCollectionView)
        achievementCollectionView.atl
            .width(equalTo: self.widthAnchor)
            .top(equalTo: categoryCollectionView.bottomAnchor)
            .bottom(equalTo: self.bottomAnchor)
    }
}

private extension HomeView {
    func makeAchievementCollectionView() -> UICollectionViewLayout {
        let itemPadding: CGFloat = 1
        let itemSize = NSCollectionLayoutSize(
            widthDimension: .fractionalWidth(1.0 / 3),
            heightDimension: .fractionalHeight(1))
        let itemInset = NSDirectionalEdgeInsets(top: itemPadding, leading: itemPadding, bottom: itemPadding, trailing: itemPadding)
        
        let groupSize = NSCollectionLayoutSize(
            widthDimension: .fractionalWidth(1.0),
            heightDimension: itemSize.widthDimension)
        
        let headerSize = NSCollectionLayoutSize(
            widthDimension: .fractionalWidth(1.0),
            heightDimension: .absolute(96))
        
        return CompositionalLayoutFactory.makeVerticalCompositionalLayout(
            itemSize: itemSize,
            itemInset: itemInset,
            groupSize: groupSize,
            subitemCount: 3,
            sectionHeaderSize: headerSize)
    }
}
