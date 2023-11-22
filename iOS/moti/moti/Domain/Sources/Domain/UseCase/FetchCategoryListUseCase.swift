//
//  FetchCategoryListUseCase.swift
//
//
//  Created by 유정주 on 11/22/23.
//

import Foundation

public struct FetchCategoryListUseCase {
    private let repository: CategoryListRepositoryProtocol
    
    public init(repository: CategoryListRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute() async throws -> [CategoryItem] {
        return try await repository.fetchCategoryList()
    }
}
