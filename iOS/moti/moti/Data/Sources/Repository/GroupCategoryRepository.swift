//
//  GroupCategoryRepository.swift
//
//
//  Created by 유정주 on 12/5/23.
//

import Foundation
import Domain

public struct GroupCategoryRepository: CategoryRepositoryProtocol {
    private let provider: ProviderProtocol
    private let groupId: Int
    
    public init(provider: ProviderProtocol = Provider(), groupId: Int) {
        self.provider = provider
        self.groupId = groupId
    }
    
    public func fetchCategory(categoryId: Int) async throws -> CategoryItem {
        let endpoint = MotiAPI.fetchGroupCategory(groupId: groupId, categoryId: categoryId)
        let responseDTO = try await provider.request(with: endpoint, type: CategoryResponseDataDTO.self)
        
        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
        return CategoryItem(dto: categoryDTO)
    }
    
    public func fetchCategoryList() async throws -> [CategoryItem] {
        // 실제 네트워크 통신
        let endpoint = MotiAPI.fetchGroupCategoryList(groupId: groupId)
        let responseDTO = try await provider.request(with: endpoint, type: CategoryListResponseDTO.self)
        
        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
        return categoryDTO.map { CategoryItem(dto: $0) }
    }
    
    public func addCategory(requestValue: AddCategoryRequestValue) async throws -> CategoryItem {
        let endpoint = MotiAPI.addGroupCategory(requestValue: requestValue, groupId: groupId)
        
        let responseDTO = try await provider.request(with: endpoint, type: CategoryResponseDataDTO.self)
        
        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
        return CategoryItem(dto: categoryDTO)
    }
    
    public func reorderCategories(requestValue: ReorderCategoriesRequestValue) async throws -> Bool {
        let endpoint = MotiAPI.reorderCategories(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: SimpleResponseDTO.self)
        
        guard let isSuccess = responseDTO.success else { throw NetworkError.decode }
        return isSuccess
    }
    
    public func deleteCategory(categoryId: Int) async throws -> Bool {
        let endpoint = MotiAPI.deleteGroupCategory(groupId: groupId, categoryId: categoryId)
        let responseDTO = try await provider.request(with: endpoint, type: SimpleResponseDTO.self)
        
        guard let isSuccess = responseDTO.success else { throw NetworkError.decode }
        return isSuccess
    }
}
