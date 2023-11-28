//
//  DeleteAchievementRepository.swift
//
//
//  Created by Kihyun Lee on 11/28/23.
//

import Foundation
import Domain

public struct DeleteAchievementRepository: DeleteAchievementRepositoryProtocol {
    private let provider: ProviderProtocol
    
    public init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    public func deleteAchievement(requestValue: DeleteAchievementRequestValue) async throws -> Bool {
        let endpoint = MotiAPI.deleteAchievement(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: DeleteAchievementResponseDTO.self)
        
        guard let isSuccess = responseDTO.success else { throw NetworkError.decode }
        return isSuccess
    }
}
