//
//  File.swift
//  
//
//  Created by 유정주 on 11/22/23.
//

import Foundation
@testable import Domain
@testable import Data

struct MockCategoryListRepository: CategoryRepositoryProtocol {

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
                "lastChallenged": "2011-04-10T20:09:31Z"
            }
        ]
    }
    """
    
    private let addCategoryJson = """
    {
        "success": true,
        "data": {
            "name": "테스트 카테고리",
            "id": 10
        }
    }
    """
    
    public func fetchCategoryList() async throws -> [CategoryItem] {
        guard let testData = fetchCategoryListJson.data(using: .utf8) else { return [] }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
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
