//
//  DeleteAchievementUseCase.swift
//
//
//  Created by Kihyun Lee on 11/28/23.
//

import Foundation

public struct DeleteAchievementUseCase {
    private let repository: AchievementRepositoryProtocol
    
    public init(repository: AchievementRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(achievementId: Int) async throws -> Bool {
        return try await repository.deleteAchievement(achievementId: achievementId)
    }
}
