//
//  FetchCategoryListUseCase.swift
//
//
//  Created by 유정주 on 11/22/23.
//

import Foundation

public struct FetchCategoryListUseCase {
    private let repository: CategoryRepositoryProtocol
    
    public init(repository: CategoryRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute() async throws -> [CategoryItem] {
        return try await repository.fetchCategoryList()
    }
}
