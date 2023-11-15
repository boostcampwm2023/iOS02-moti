//
//  ListDiffableDataSource.swift
//
//
//  Created by 유정주 on 11/15/23.
//

import UIKit

struct ListDiffableDataSource<T: Hashable> {
    typealias DataSource = UICollectionViewDiffableDataSource<Section, T>
    typealias SnapShot = NSDiffableDataSourceSnapshot<Section, T>
    
    enum Section: Int, CaseIterable {
        case main
    }
    
    private let dataSource: DataSource
    
    init(dataSource: DataSource) {
        self.dataSource = dataSource
    }
    
    // 모든 데이터 제거
    func reset() {
        DispatchQueue.main.async {
            var snapshot = SnapShot()
            snapshot.appendSections([.main])
            dataSource.apply(snapshot)
        }
    }

    /// 새로운 데이터로 교체
    func update(data: [T]) {
        DispatchQueue.main.async {
            var snapshot = SnapShot()
            snapshot.appendSections([.main])
            snapshot.appendItems(data, toSection: .main)
            dataSource.apply(snapshot)
        }
    }
}
