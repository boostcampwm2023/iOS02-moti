//
//  UpdateAchievementRepository.swift
//
//
//  Created by Kihyun Lee on 11/30/23.
//

import Foundation
import Domain

public struct UpdateAchievementRepository: UpdateAchievementRepositoryProtocol {
    private let provider: ProviderProtocol
    
    public init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    public func updateAchievement(requestValue: UpdateAchievementRequestValue) async throws -> Bool {
        let endpoint = MotiAPI.updateAchievement(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: UpdateAchievementResponseDTO.self)
        
        guard let isSuccess = responseDTO.success else { throw NetworkError.decode }
        return isSuccess
    }
}
