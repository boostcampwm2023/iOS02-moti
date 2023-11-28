//
//  DeleteAchievementUseCase.swift
//
//
//  Created by Kihyun Lee on 11/28/23.
//

import Foundation

public struct DeleteAchievementRequestValue: RequestValue {
    public let id: Int
    
    public init(id: Int) {
        self.id = id
    }
}

public struct DeleteAchievementUseCase {
    private let repository: DeleteAchievementRepositoryProtocol
    
    public init(repository: DeleteAchievementRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(requestValue: DeleteAchievementRequestValue) async throws -> Bool {
        return try await repository.deleteAchievement(requestValue: requestValue)
    }
}

