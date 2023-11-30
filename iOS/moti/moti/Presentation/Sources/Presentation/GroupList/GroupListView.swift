//
//  GroupListView.swift
//  
//
//  Created by 유정주 on 11/30/23.
//

import UIKit

final class GroupListView: UIView {

    private(set) lazy var groupListCollectionView: UICollectionView = {
        let collectionView = UICollectionView(frame: .zero, collectionViewLayout: makeCollectionViewLayout())
        collectionView.backgroundColor = .motiBackground
        collectionView.register(with: GroupListCollectionViewCell.self)
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

}

// MARK: - Setup
private extension GroupListView {
    private func setupUI() {
        groupListCollectionView.atl
            .top(equalTo: safeAreaLayoutGuide.topAnchor)
            .bottom(equalTo: bottomAnchor)
            .horizontal(equalTo: safeAreaLayoutGuide)
    }
}

private extension GroupListView {
    func makeCollectionViewLayout() -> UICollectionViewLayout {
        let itemPadding: CGFloat = 20
        let itemSize = NSCollectionLayoutSize(
            widthDimension: .fractionalWidth(1.0),
            heightDimension: .absolute(80))
        let itemInset = NSDirectionalEdgeInsets(top: itemPadding, leading: 0, bottom: itemPadding, trailing: 0)
        
        return CompositionalLayoutFactory.makeVerticalCompositionalLayout(
            itemSize: itemSize,
            itemInset: itemInset,
            groupSize: itemSize)
    }
}
