//
//  AchievementListRepository.swift
//
//
//  Created by Kihyun Lee on 11/21/23.
//

import Foundation
import Domain
import Core

public struct AchievementListRepository: AchievementListRepositoryProtocol {
    private let provider: ProviderProtocol
    
    public init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    public func fetchAchievementList(
        requestValue: FetchAchievementListRequestValue? = nil
    ) async throws -> ([Achievement], FetchAchievementListRequestValue?) {
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
            
            return (achievements, next)
        } else {
            return (achievements, nil)
        }
    }
}
