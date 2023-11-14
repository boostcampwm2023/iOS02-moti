//
//  RecordDiffableDataSource.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit
import Domain

struct RecordDiffableDataSource {
    typealias DataSource = UICollectionViewDiffableDataSource<Section, Record>
    typealias SnapShot = NSDiffableDataSourceSnapshot<Section, Record>
    
    enum Section: Int, CaseIterable {
        case main
    }
    
    // MARK: - Properties
    private var dataSource: DataSource?
    
    init(dataSource: DataSource? = nil) {
        self.dataSource = dataSource
        reset()
    }
    
    func reset() {
        guard let dataSource = dataSource else { return }
        
        var snapshot = SnapShot()
        snapshot.appendSections(Section.allCases)
        dataSource.apply(snapshot)
    }

    func update(with records: [Record]) {
        guard let dataSource = dataSource else { return }
        
        var snapshot = dataSource.snapshot()
        snapshot.appendItems(records, toSection: Section.main)
        dataSource.apply(snapshot)
    }
}
