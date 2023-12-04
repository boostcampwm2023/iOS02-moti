//
//  AchievementRepository.swift
//
//
//  Created by Kihyun Lee on 11/21/23.
//

import Foundation
import Domain
import Core

public struct AchievementRepository: AchievementRepositoryProtocol {
    private let provider: ProviderProtocol
    
    public init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    public func fetchAchievementList(
        requestValue: FetchAchievementListRequestValue? = nil
    ) async throws -> AchievementListItem {
        let endpoint = MotiAPI.fetchAchievementList(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: AchievementListResponseDTO.self)
        
        guard let achievementListDataDTO = responseDTO.data else { throw NetworkError.decode }
        guard let achievementListDTO = achievementListDataDTO.data else { throw NetworkError.decode }
        
        let achievements = achievementListDTO.map { Achievement(dto: $0) }
        if let nextDTO = achievementListDataDTO.next {
            let next = FetchAchievementListRequestValue(
                categoryId: nextDTO.categoryId ?? -1,
                take: nextDTO.take ?? -1,
                whereIdLessThan: nextDTO.whereIdLessThan ?? -1
            )
            
            return AchievementListItem(achievements: achievements, next: next)
        } else {
            return AchievementListItem(achievements: achievements)
        }
    }
    
    public func deleteAchievement(requestValue: DeleteAchievementRequestValue) async throws -> Bool {
        let endpoint = MotiAPI.deleteAchievement(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: DeleteAchievementResponseDTO.self)
        
        guard let isSuccess = responseDTO.success else { throw NetworkError.decode }
        return isSuccess
    }
    
    public func fetchDetailAchievement(requestValue: FetchDetailAchievementRequestValue) async throws -> Achievement {
        let endpoint = MotiAPI.fetchDetailAchievement(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: DetailAchievementResponseDTO.self)
        
        guard let detailAchievementDTO = responseDTO.data else { throw NetworkError.decode }
        return Achievement(dto: detailAchievementDTO)
    }
    
    public func updateAchievement(requestValue: UpdateAchievementRequestValue) async throws -> Bool {
        let endpoint = MotiAPI.updateAchievement(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: UpdateAchievementResponseDTO.self)
        
        guard let isSuccess = responseDTO.success else { throw NetworkError.decode }
        return isSuccess
    }
    
    public func postAchievement(requestValue: PostAchievementRequestValue) async throws -> Achievement {
        let endpoint = MotiAPI.postAchievement(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: DetailAchievementResponseDTO.self)

        guard let detailAchievementDataDTO = responseDTO.data else { throw NetworkError.decode }
        return Achievement(dto: detailAchievementDataDTO)
    }
}
