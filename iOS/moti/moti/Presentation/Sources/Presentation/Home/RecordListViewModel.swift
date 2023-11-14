//
//  RecordViewModel.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation
import Domain

final class RecordListViewModel {
    private var dataSource: RecordDiffableDataSource
    private let fetchRecordListUseCase: FetchRecordListUseCase
    
    var records: [Record] = []
    
    init(
        dataSource: RecordDiffableDataSource = .init(),
        fetchRecordListUseCase: FetchRecordListUseCase
    ) {
        self.dataSource = dataSource
        self.fetchRecordListUseCase = fetchRecordListUseCase
    }
    
    func setupDataSource(_ dataSource: RecordDiffableDataSource) {
        self.dataSource = dataSource
    }
    
    func updateDataSource(records: [Record]) {
        dataSource.update(with: records)
    }
    
    func fetchRecordList() throws {
        Task {
            records = try await fetchRecordListUseCase.execute()
            updateDataSource(records: records)
        }
    }
}
