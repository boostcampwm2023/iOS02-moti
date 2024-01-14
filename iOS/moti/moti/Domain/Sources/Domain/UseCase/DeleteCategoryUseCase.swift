//
//  DeleteCategoryUseCase.swift
//  
//
//  Created by 유정주 on 1/14/24.
//

import Foundation

public struct DeleteCategoryUseCase {
    private let repository: CategoryRepositoryProtocol
    
    public init(repository: CategoryRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(categoryId: Int) async throws -> Bool {
        return try await repository.deleteCategory(categoryId: categoryId)
    }
}
