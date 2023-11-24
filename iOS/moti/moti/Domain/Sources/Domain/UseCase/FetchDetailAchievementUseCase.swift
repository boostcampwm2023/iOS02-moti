//
//  FetchDetailAchievementUseCase.swift
//
//
//  Created by Kihyun Lee on 11/23/23.
//

import Foundation

public struct FetchDetailAchievementRequestValue: RequestValue {
    public let id: Int
    
    public init(id: Int) {
        self.id = id
    }
}

public struct FetchDetailAchievementUseCase {
    private let repository: DetailAchievementRepositoryProtocol
    
    public init(repository: DetailAchievementRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(requestValue: FetchDetailAchievementRequestValue) async throws -> Achievement {
        return try await repository.fetchDetailAchievement(requestValue: requestValue)
    }
}

