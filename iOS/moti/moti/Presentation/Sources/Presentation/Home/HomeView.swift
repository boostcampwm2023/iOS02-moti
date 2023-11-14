//
//  HomeView.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit

final class HomeView: UIView {
    
    // 카테고리 리스트 컬렉션 뷰
    let categoryCollectionView = {
        let collectionView = UIView()
        collectionView.backgroundColor = .blue
        return collectionView
    }()
    
    // 달성 기록 리스트 컬렉션 뷰
    lazy var recordCollectionView: UICollectionView = {
        let collectionView = UICollectionView(frame: .zero, collectionViewLayout: makeCompositionalLayout())
        collectionView.backgroundColor = .motiBackground
        collectionView.register(with: RecordCollectionViewCell.self)
        collectionView.register(with: HeaderView.self, elementKind: UICollectionView.elementKindSectionHeader)
        return collectionView
    }()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    private func setupUI() {
        setupCategoryCollectionView()
        setupRecordCollectionView()
    }
    
    private func setupCategoryCollectionView() {
        addSubview(categoryCollectionView)
        categoryCollectionView.atl
            .width(equalTo: self.widthAnchor)
            .height(constant: 50)
            .top(equalTo: self.topAnchor, constant: 120)
    }
    
    private func setupRecordCollectionView() {
        addSubview(recordCollectionView)
        recordCollectionView.atl
            .width(equalTo: self.widthAnchor)
            .top(equalTo: categoryCollectionView.bottomAnchor)
            .bottom(equalTo: self.bottomAnchor, constant: -10)
    }
}

private extension HomeView {
    func makeCompositionalLayout() -> UICollectionViewLayout {
        let layout = UICollectionViewCompositionalLayout { (sectionIndex, layoutEnvironment) -> NSCollectionLayoutSection? in
            
            let itemPadding: CGFloat = 1
            let itemSize = NSCollectionLayoutSize(
                widthDimension: .fractionalWidth(1.0 / 3),
                heightDimension: .fractionalHeight(1.0))
            let item = NSCollectionLayoutItem(layoutSize: itemSize)
            item.contentInsets = NSDirectionalEdgeInsets(top: itemPadding, leading: itemPadding, bottom: itemPadding, trailing: itemPadding)

            let groupSize = NSCollectionLayoutSize(
                widthDimension: .fractionalWidth(1.0),
                heightDimension: .absolute(RecordCollectionViewCell.cellHeight))
            
            let group = NSCollectionLayoutGroup.horizontal(layoutSize: groupSize, subitems: [item, item, item])
//            iOS 16
//            let group = NSCollectionLayoutGroup.vertical(layoutSize: groupSize, repeatingSubitem: item, count: 1)
            
            let section = NSCollectionLayoutSection(group: group)
            let headerSize = NSCollectionLayoutSize(
                widthDimension: .fractionalWidth(1.0),
                heightDimension: .estimated(96))
            let sectionHeader = NSCollectionLayoutBoundarySupplementaryItem(
                layoutSize: headerSize,
                elementKind: UICollectionView.elementKindSectionHeader,
                alignment: .top)

            section.boundarySupplementaryItems = [sectionHeader]
            section.contentInsets = NSDirectionalEdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 0)
            return section
        }
        
        return layout
    }
}
