//
//  FetchAchievementListUseCase.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public struct FetchAchievementListRequestValue: RequestValue {
    public let categoryId: Int
    public let take: Int
    public let whereIdLessThan: Int
}

public struct FetchAchievementListUseCase {
    private let repository: AchievementListRepositoryProtocol
    
    public init(repository: AchievementListRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(requestValue: FetchAchievementListRequestValue? = nil) async throws -> [Achievement] {
        return try await repository.fetchAchievementList(requestValue: requestValue)
    }
}
