//
//  GroupAchievementRepository.swift
//
//
//  Created by 유정주 on 12/04/23.
//

import Foundation
import Domain
import Core

public struct GroupAchievementRepository: GroupAchievementRepositoryProtocol {
    private let provider: ProviderProtocol
    public let groupId: Int
    
    public init(provider: ProviderProtocol = Provider(), groupId: Int) {
        self.provider = provider
        self.groupId = groupId
    }
    
    public func fetchAchievementList(
        requestValue: FetchAchievementListRequestValue? = nil
    ) async throws -> ([Achievement], FetchAchievementListRequestValue?) {
        let sampleJson = """
        {
            "success": true,
            "data": {
                "data": [
                    {
                        "id": 16,
                        "thumbnailUrl": ""https://serverless-thumbnail.kr.object.ncloudstorage.com/./049038f8-6984-46f6-8481-d2fafb507fe7.jpeg"",
                        "title": "test16",
                        "userCode": "abcd2df"
                    },
                    {
                        "id": 15,
                        "thumbnailUrl": ""https://serverless-thumbnail.kr.object.ncloudstorage.com/./049038f8-6984-46f6-8481-d2fafb507fe7.jpeg"",
                        "title": "test15",
                        "userCode": "abcd2df"
                    },
                    {
                        "id": 14,
                        "thumbnailUrl": ""https://serverless-thumbnail.kr.object.ncloudstorage.com/./049038f8-6984-46f6-8481-d2fafb507fe7.jpeg"",
                        "title": "test14",
                        "userCode": "abcd2df"
                    },
                    {
                        "id": 5,
                        "thumbnailUrl": ""https://serverless-thumbnail.kr.object.ncloudstorage.com/./049038f8-6984-46f6-8481-d2fafb507fe7.jpeg"",
                        "title": "test13",
                        "userCode": "abcd2df"
                    },
                ],
                "count": 4,
                "next": {
                    "take": 30,
                    "whereIdLessThan": 5,
                    "categoryId": -1
                }
            }
        }
        """
        
        // 실제 API 요청
//        let endpoint = MotiAPI.fetchGroupAchievementList(requestValue: requestValue, groupId: groupId)
//        let responseDTO = try await provider.request(with: endpoint, type: AchievementListResponseDTO.self)
        guard let testData = sampleJson.data(using: .utf8) else { throw NetworkError.decode }
        let responseDTO = try JSONDecoder().decode(AchievementListResponseDTO.self, from: testData)
        
        guard let achievementListDataDTO = responseDTO.data else { throw NetworkError.decode }
        guard let achievementListDTO = achievementListDataDTO.data else { throw NetworkError.decode }
        
        let achievements = achievementListDTO.map { Achievement(dto: $0) }
        if let nextDTO = achievementListDataDTO.next {
            let next = FetchAchievementListRequestValue(
                categoryId: nextDTO.categoryId ?? -1,
                take: nextDTO.take ?? -1,
                whereIdLessThan: nextDTO.whereIdLessThan ?? -1
            )
            
            return (achievements, next)
        } else {
            return (achievements, nil)
        }
    }
    
    public func deleteAchievement(requestValue: DeleteAchievementRequestValue) async throws -> Bool {
        let endpoint = MotiAPI.deleteGroupAchievement(requestValue: requestValue, groupId: groupId)
        let responseDTO = try await provider.request(with: endpoint, type: DeleteAchievementResponseDTO.self)
        
        guard let isSuccess = responseDTO.success else { throw NetworkError.decode }
        return isSuccess
    }
    
    public func fetchDetailAchievement(requestValue: FetchDetailAchievementRequestValue) async throws -> Achievement {
        let endpoint = MotiAPI.fetchGroupDetailAchievement(requestValue: requestValue, groupId: groupId)
        let responseDTO = try await provider.request(with: endpoint, type: DetailAchievementResponseDTO.self)
        
        guard let detailAchievementDTO = responseDTO.data else { throw NetworkError.decode }
        return Achievement(dto: detailAchievementDTO)
    }
    
    public func updateAchievement(requestValue: UpdateAchievementRequestValue) async throws -> Bool {
        let endpoint = MotiAPI.updateGroupAchievement(requestValue: requestValue, groupId: groupId)
        let responseDTO = try await provider.request(with: endpoint, type: UpdateAchievementResponseDTO.self)
        
        guard let isSuccess = responseDTO.success else { throw NetworkError.decode }
        return isSuccess
    }
    
    public func postAchievement(requestValue: PostAchievementRequestValue) async throws -> Achievement {
        let endpoint = MotiAPI.postGroupAchievement(requestValue: requestValue, groupId: groupId)
        let responseDTO = try await provider.request(with: endpoint, type: DetailAchievementResponseDTO.self)

        guard let detailAchievementDataDTO = responseDTO.data else { throw NetworkError.decode }
        return Achievement(dto: detailAchievementDataDTO)
    }
}
