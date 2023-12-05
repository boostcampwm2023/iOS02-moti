//
//  GroupCategoryRepository.swift
//
//
//  Created by 유정주 on 12/5/23.
//

import Foundation
import Domain

public struct GroupCategoryRepository: CategoryListRepositoryProtocol {
    private let provider: ProviderProtocol
    private let groupId: Int
    
    public init(provider: ProviderProtocol = Provider(), groupId: Int) {
        self.provider = provider
        self.groupId = groupId
    }
    
    public func fetchCategoryList() async throws -> [CategoryItem] {
        let sampleJson = """
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
                    "id": -1,
                    "name": "미설정",
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
        
        // 실제 네트워크 통신
//        let endpoint = MotiAPI.fetchGroupCategoryList(groupId: groupId)
//        let responseDTO = try await provider.request(with: endpoint, type: CategoryListResponseDTO.self)
        guard let testData = sampleJson.data(using: .utf8) else { throw NetworkError.decode }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let responseDTO = try decoder.decode(CategoryListResponseDTO.self, from: testData)
        
        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
        return categoryDTO.map { CategoryItem(dto: $0) }
    }
    
    public func addCategory(requestValue: AddCategoryRequestValue) async throws -> CategoryItem {
        let endpoint = MotiAPI.addGroupCategory(requestValue: requestValue, groupId: groupId)
        
        let responseDTO = try await provider.request(with: endpoint, type: CategoryResponseDataDTO.self)
        
        guard let categoryDTO = responseDTO.data else { throw NetworkError.decode }
        return CategoryItem(dto: categoryDTO)
    }
}
