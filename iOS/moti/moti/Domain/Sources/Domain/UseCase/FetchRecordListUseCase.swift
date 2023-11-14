//
//  FetchRecordListUseCase.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public struct FetchRecordListUseCase {
    private let repository: RecordListRepositoryProtocol
    
    public init(repository: RecordListRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute() async throws -> [Record] {
        return try await repository.fetchRecordList()
    }
}
