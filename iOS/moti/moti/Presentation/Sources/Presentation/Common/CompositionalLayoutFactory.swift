//
//  CompositionalLayoutFactory.swift
//
//
//  Created by 유정주 on 11/15/23.
//

import UIKit

enum CompositionalLayoutFactory {
    static func makeVerticalCompositionalLayout(
        itemSize: NSCollectionLayoutSize,
        itemInset: NSDirectionalEdgeInsets? = nil,
        groupSize: NSCollectionLayoutSize,
        subitemCount: Int = 1,
        groupInset: NSDirectionalEdgeInsets? = nil,
        groupEdgeSpacing: NSCollectionLayoutEdgeSpacing? = nil,
        sectionHeaderSize: NSCollectionLayoutSize? = nil
    ) -> UICollectionViewLayout {
        let layout = UICollectionViewCompositionalLayout { (sectionIndex, layoutEnvironment) -> NSCollectionLayoutSection? in
            let item = NSCollectionLayoutItem(layoutSize: itemSize)
            if let itemInset = itemInset {
                item.contentInsets = itemInset
            }

            let group = NSCollectionLayoutGroup.horizontal(layoutSize: groupSize, subitems: Array(repeating: item, count: subitemCount))
            if let groupInset = groupInset {
                group.contentInsets = groupInset
            }
            if let groupEdgeSpacing = groupEdgeSpacing {
                group.edgeSpacing = groupEdgeSpacing
            }
            
            let section = NSCollectionLayoutSection(group: group)
            if let sectionHeaderSize = sectionHeaderSize {
                let sectionHeader = NSCollectionLayoutBoundarySupplementaryItem(
                    layoutSize: sectionHeaderSize,
                    elementKind: UICollectionView.elementKindSectionHeader,
                    alignment: .top)
                section.boundarySupplementaryItems = [sectionHeader]
            }
            
            return section
        }
        
        return layout
    }
    
    static func makeHorizontalCompositionalLayout(
        itemSize: NSCollectionLayoutSize,
        itemInset: NSDirectionalEdgeInsets? = nil,
        groupSize: NSCollectionLayoutSize,
        subitemCount: Int = 1,
        groupInset: NSDirectionalEdgeInsets? = nil,
        groupEdgeSpacing: NSCollectionLayoutEdgeSpacing? = nil,
        sectionHeader: NSCollectionLayoutBoundarySupplementaryItem? = nil
    ) -> UICollectionViewLayout {
        let layout = UICollectionViewCompositionalLayout { (sectionIndex, layoutEnvironment) -> NSCollectionLayoutSection? in
            let item = NSCollectionLayoutItem(layoutSize: itemSize)
            if let itemInset = itemInset {
                item.contentInsets = itemInset
            }

            let group = NSCollectionLayoutGroup.vertical(layoutSize: groupSize, subitems: Array(repeating: item, count: subitemCount))
            if let groupInset = groupInset {
                group.contentInsets = groupInset
            }
            if let groupEdgeSpacing = groupEdgeSpacing {
                group.edgeSpacing = groupEdgeSpacing
            }
            
            let section = NSCollectionLayoutSection(group: group)
            if let sectionHeader = sectionHeader {
                section.boundarySupplementaryItems = [sectionHeader]
            }
            section.orthogonalScrollingBehavior = .continuous
            
            return section
        }
        
        return layout
    }
}
