//
//  BlockUserView.swift
//
//
//  Created by Kihyun Lee on 12/29/23.
//

import UIKit

final class BlockedUserListView: UIView {

    
    // MARK: - Views
    private(set) lazy var blockedUserListCollectionView: UICollectionView = {
        let collectionView = UICollectionView(frame: .zero, collectionViewLayout: makeCollectionViewLayout())
        collectionView.backgroundColor = .motiBackground
        collectionView.register(with: BlockedUserListCollectionViewCell.self)
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
    
    private func setupUI() {
        addSubview(blockedUserListCollectionView)
        blockedUserListCollectionView.atl
            .top(equalTo: safeAreaLayoutGuide.topAnchor)
            .bottom(equalTo: bottomAnchor)
            .horizontal(equalTo: safeAreaLayoutGuide)
    }
}

private extension BlockedUserListView {

    func makeCollectionViewLayout() -> UICollectionViewLayout {
        let itemPadding: CGFloat = 20
        let itemSize = NSCollectionLayoutSize(
            widthDimension: .fractionalWidth(1.0),
            heightDimension: .absolute(80))
        let itemInset = NSDirectionalEdgeInsets(top: 0, leading: itemPadding, bottom: 0, trailing: itemPadding)
        let groupInset = NSDirectionalEdgeInsets(top: itemPadding, leading: 0, bottom: itemPadding, trailing: 0)
        let groupEdgeSpacing = NSCollectionLayoutEdgeSpacing(leading: .none, top: .fixed(5), trailing: .none, bottom: .fixed(5))
        
        return CompositionalLayoutFactory.makeVerticalCompositionalLayout(
            itemSize: itemSize,
            itemInset: itemInset,
            groupSize: itemSize,
            groupInset: groupInset,
            groupEdgeSpacing: groupEdgeSpacing
        )
    }
}

