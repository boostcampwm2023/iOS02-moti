//
//  DetailAchievementRepository.swift
//
//
//  Created by Kihyun Lee on 11/23/23.
//

import Foundation
import Domain

public struct DetailAchievementRepository: DetailAchievementRepositoryProtocol {
    private let provider: ProviderProtocol
    
    public init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    public func fetchDetailAchievement(requestValue: FetchDetailAchievementRequestValue) async throws -> Achievement {
        let endpoint = MotiAPI.fetchDetailAchievement(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: DetailAchievementResponseDTO.self)
        
        guard let detailAchievementDTO = responseDTO.data else { throw NetworkError.decode }
        return Achievement(dto: detailAchievementDTO)
    }
}
