//
//  HomeView.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit
import Design
import Domain

final class HomeView: UIView {
    
    // MARK: - Views
    // 카테고리 추가 버튼
    let catergoryAddButton: BounceButton = {
        let button = BounceButton()
        button.setTitle("+", for: .normal)
        return button
    }()
    
    private let separatorView: UIView = {
        let view = UIView()
        view.backgroundColor = .primaryDarkGray
        return view
    }()
    
    // 카테고리 리스트 컬렉션 뷰
    private(set) lazy var categoryCollectionView: UICollectionView = {
        let collectionView = UICollectionView(frame: .zero, collectionViewLayout: makeCategoryCollectionView())
        // 세로로 스크롤이 안 되도록 설정
        collectionView.alwaysBounceVertical = false
        collectionView.backgroundColor = .motiBackground
        collectionView.register(with: CategoryCollectionViewCell.self)
        return collectionView
    }()
    
    // 달성 기록 리스트 컬렉션 뷰
    private(set) lazy var achievementCollectionView: UICollectionView = {
        let collectionView = UICollectionView(frame: .zero, collectionViewLayout: makeAchievementCollectionView())
        collectionView.backgroundColor = .motiBackground
        collectionView.refreshControl = refreshControl
        collectionView.register(with: AchievementCollectionViewCell.self)
        collectionView.register(with: HeaderView.self, elementKind: UICollectionView.elementKindSectionHeader)
        return collectionView
    }()
    
    // 당겨서 새로고침 로딩뷰
    let refreshControl = {
        let refreshControl = UIRefreshControl()
        refreshControl.attributedTitle = NSAttributedString(
            string: "로딩 중...",
            attributes: [
                NSAttributedString.Key.font: UIFont.medium
            ]
        )
        return refreshControl
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
    
    // MARK: - Methods
    func updateAchievementHeader(with category: CategoryItem) {        
        guard let header = achievementCollectionView.visibleSupplementaryViews(
            ofKind: UICollectionView.elementKindSectionHeader
        ).first as? HeaderView else { return }
        
        header.configure(category: category)
    }
    
    func endRefreshing() {
        if refreshControl.isRefreshing {
            refreshControl.endRefreshing()
        }
    }
}

// MARK: - SetUp
private extension HomeView {
    private func setupUI() {
        setupCategoryAddButton()
        setupCategoryCollectionView()
        setupAchievementCollectionView()
    }
    
    private func setupCategoryAddButton() {
        addSubview(catergoryAddButton)
        catergoryAddButton.atl
            .size(width: 37, height: 37)
            .top(equalTo: self.safeAreaLayoutGuide.topAnchor, constant: 10)
            .left(equalTo: self.safeAreaLayoutGuide.leftAnchor, constant: 10)
        
        addSubview(separatorView)
        separatorView.atl
            .width(constant: 1)
            .height(equalTo: catergoryAddButton.heightAnchor)
            .centerY(equalTo: catergoryAddButton.centerYAnchor)
            .left(equalTo: catergoryAddButton.rightAnchor, constant: 5)
    }
    
    private func setupCategoryCollectionView() {
        addSubview(categoryCollectionView)
        categoryCollectionView.atl
            .height(constant: 37)
            .top(equalTo: self.safeAreaLayoutGuide.topAnchor, constant: 10)
            .left(equalTo: separatorView.rightAnchor)
            .right(equalTo: self.safeAreaLayoutGuide.rightAnchor)
    }
    
    private func setupAchievementCollectionView() {
        addSubview(achievementCollectionView)
        achievementCollectionView.atl
            .width(equalTo: self.widthAnchor)
            .top(equalTo: categoryCollectionView.bottomAnchor, constant: 10)
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
    
    func makeCategoryCollectionView() -> UICollectionViewLayout {
        let itemSize = NSCollectionLayoutSize(
            widthDimension: .estimated(44),
            heightDimension: .fractionalHeight(1))
        
        let groupEdgeSpacing = NSCollectionLayoutEdgeSpacing(leading: .fixed(5), top: .none, trailing: .none, bottom: .none)

        return CompositionalLayoutFactory.makeHorizontalCompositionalLayout(
            itemSize: itemSize,
            groupSize: itemSize,
            groupEdgeSpacing: groupEdgeSpacing)
    }
}
