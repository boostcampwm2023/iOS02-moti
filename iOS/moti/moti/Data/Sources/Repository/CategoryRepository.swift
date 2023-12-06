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
    
    public init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    public func fetchCategory(categoryId: Int) async throws -> CategoryItem {
        let endpoint = MotiAPI.fetchCategory(categoryId: categoryId)
        let responseDTO = try await provider.request(with: endpoint, type: CategoryResponseDataDTO.self)
        
        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
        return CategoryItem(dto: categoryDTO)
    }
    
    public func fetchCategoryList() async throws -> [CategoryItem] {
        let endpoint = MotiAPI.fetchCategoryList
        let responseDTO = try await provider.request(with: endpoint, type: CategoryListResponseDTO.self)
        
        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
        return categoryDTO.map { CategoryItem(dto: $0) }
    }
    
    public func addCategory(requestValue: AddCategoryRequestValue) async throws -> CategoryItem {
        let endpoint = MotiAPI.addCategory(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: CategoryResponseDataDTO.self)
        
        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
        return CategoryItem(dto: categoryDTO)
    }
}
