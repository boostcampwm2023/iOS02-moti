//
//  AddCategoryUseCase.swift
//
//
//  Created by 유정주 on 11/22/23.
//

import Foundation

public struct AddCategoryRequestValue: RequestValue {
    public let name: String
    
    public init(name: String) {
        self.name = name
    }
}

public struct AddCategoryUseCase {
    private let repository: CategoryListRepositoryProtocol
    
    public init(repository: CategoryListRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(requestValue: AddCategoryRequestValue) async throws -> CategoryItem {
        return try await repository.addCategory(requestValue: requestValue)
    }
}
