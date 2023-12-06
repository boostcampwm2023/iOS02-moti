//
//  CategoryRepository.swift
//  
//
//  Created by 유정주 on 11/22/23.
//

import Foundation
import Domain

public struct CategoryRepository: CategoryRepositoryProtocol {
    private let provider: ProviderProtocol
    // 싱글턴 객체로 관리하기 위해 외부에서 주입 받지 않음
    private let storage: CategoryStorageProtocol = CategoryStorage.shared
    
    public init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    public func fetchCategory(categoryId: Int) async throws -> CategoryItem {
        return .init(id: -1, name: "")
    }
    
    public func fetchCategoryList() async throws -> [CategoryItem] {
        guard storage.isEmpty else {
            return storage.fetchAll()
        }
        
        let endpoint = MotiAPI.fetchCategoryList
        let responseDTO = try await provider.request(with: endpoint, type: CategoryListResponseDTO.self)
        
        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
        
        let categories = categoryDTO.map { CategoryItem(dto: $0) }
        storage.create(categories: categories)
        
        return categories
    }
    
    public func addCategory(requestValue: AddCategoryRequestValue) async throws -> CategoryItem {
        let endpoint = MotiAPI.addCategory(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: CategoryResponseDataDTO.self)
        
        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
        
        let category = CategoryItem(dto: categoryDTO)
        storage.create(category: category)
        
        return category
    }
}
