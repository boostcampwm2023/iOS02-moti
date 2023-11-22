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
//    
//    public func addCategory(requestValue: AddCategoryRequestValue) async throws -> CategoryItem {
//        let endpoint = MotiAPI.addCategory(requestValue: requestValue)
//        let responseDTO = try await provider.request(with: endpoint, type: CategoryResponseDataDTO.self)
//        
//        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
//        return CategoryItem(dto: categoryDTO)
//    }
    
    private let fetchCategoryListJson = """
    {
        "success": true,
        "data": [
            {
                "id": 0,
                "name": "전체",
                "continued": 150,
                "lastChallenged": "2011-04-10T20:09:31Z"
            },
            {
                "id": 1000,
                "name": "다이어트",
                "continued": 10,
                "lastChallenged": "2017-04-10T20:09:31Z"
            }
        ]
    }
    """
    
    private let addCategoryJson = """
    {
        "success": true,
        "data": {
            "name": "추가된 카테고리 이름",
            "id": 10
        }
    }
    """
    
    public func fetchCategoryList() async throws -> [CategoryItem] {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        
        guard let testData = fetchCategoryListJson.data(using: .utf8) else { return [] }
        let responseDTO = try decoder.decode(CategoryListResponseDTO.self, from: testData)

        guard let categoryDTO = responseDTO.data else { return [] }
        return categoryDTO.map { CategoryItem(dto: $0) }
    }

    public func addCategory(requestValue: AddCategoryRequestValue) async throws -> CategoryItem {
        guard let testData = addCategoryJson.data(using: .utf8) else { throw NetworkError.decode }
        let responseDTO = try JSONDecoder().decode(CategoryResponseDataDTO.self, from: testData)

        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
        return CategoryItem(dto: categoryDTO)
    }
}
