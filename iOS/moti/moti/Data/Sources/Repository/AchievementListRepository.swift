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
    
    public func fetchAchievementList(requestValue: FetchAchievementListRequestValue? = nil) async throws -> [Achievement] {
        let endpoint = MotiAPI.fetchAchievementList(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: AchievementListResponseDTO.self)
        
        guard let achievementListDataDTO = responseDTO.data else { throw NetworkError.decode }
        guard let achievementListDTO = achievementListDataDTO.data else { throw NetworkError.decode }
        return achievementListDTO.map { Achievement(dto: $0) }
    }
}
