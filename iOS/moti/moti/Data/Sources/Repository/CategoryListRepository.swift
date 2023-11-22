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
    
    public init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
//    public func fetchCategoryList() async throws -> [CategoryItem] {
//        let endpoint = MotiAPI.fetchCategoryList
//        let responseDTO = try await provider.request(with: endpoint, type: CategoryListResponseDTO.self)
//        
//        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
//        return categoryDTO.map { CategoryItem(dto: $0) }
//    }
    
    private let json = """
    {
        "success": true,
      "data": [
                {
                    "id": 0,
                    "name": "전체",
                    "continued": 100,
                    "lastChallenged": "2023-11-08T10:20:10.0202"
                },
                {
                    "id": 1000,
                    "name": "다이어트",
                    "continued": 32,
                    "lastChallenged": "2023-11-08T10:20:10.0202"
                }
            ]
    }
    """
    
    public func fetchCategoryList() async throws -> [CategoryItem] {
        guard let testData = json.data(using: .utf8) else { return [] }
        let responseDTO = try JSONDecoder().decode(CategoryListResponseDTO.self, from: testData)

        guard let categoryDTO = responseDTO.data else { return [] }
        return categoryDTO.map { CategoryItem(dto: $0) }
    }

}
