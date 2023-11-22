//
//  File.swift
//  
//
//  Created by 유정주 on 11/22/23.
//

import Foundation
import Domain

public struct CategoryListRepository: CategoryListRepositoryProtocol {
    private let provider: ProviderProtocol
    
    init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    public func fetchCategoryList() async throws -> [Domain.Category] {
        let endpoint = MotiAPI.fetchCategoryList
        let responseDTO = try await provider.request(with: endpoint, type: CategoryListResponseDTO.self)
        
        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
        return categoryDTO.map { Category(dto: $0) }
    }
}
