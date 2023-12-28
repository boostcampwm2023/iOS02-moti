//
//  ReorderCategoriesUseCase.swift
//  
//
//  Created by Kihyun Lee on 12/27/23.
//

import Foundation

public struct ReorderCategoriesRequestValue: RequestValue {
    public let order: [Int]
    
    public init(order: [Int]) {
        self.order = order
    }
}

public struct ReorderCategoriesUseCase {
    private let repository: CategoryRepositoryProtocol
    
    public init(repository: CategoryRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(requestValue: ReorderCategoriesRequestValue) async throws -> Bool {
        return try await repository.reorderCategories(requestValue: requestValue)
    }
}
