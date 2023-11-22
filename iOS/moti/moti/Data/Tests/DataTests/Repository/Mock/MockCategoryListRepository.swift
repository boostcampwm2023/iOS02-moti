//
//  File.swift
//  
//
//  Created by 유정주 on 11/22/23.
//

import Foundation
@testable import Domain
@testable import Data

struct MockCategoryListRepository: CategoryListRepositoryProtocol {
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
    
    public func fetchCategoryList() async throws -> [Domain.Category] {
        guard let testData = json.data(using: .utf8) else { return [] }
        let responseDTO = try JSONDecoder().decode(CategoryListResponseDTO.self, from: testData)

        guard let categoryDTO = responseDTO.data else { return [] }
        return categoryDTO.map { Category(dto: $0) }
    }
}
