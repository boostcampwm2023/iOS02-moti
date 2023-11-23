//
//  FetchAchievementListUseCase.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public struct FetchAchievementListRequestValue: RequestValue {
    public let categoryId: Int
    public let take: Int?
    public let whereIdLessThan: Int?
    
    public init(categoryId: Int, take: Int?, whereIdLessThan: Int?) {
        self.categoryId = categoryId
        self.take = take
        self.whereIdLessThan = whereIdLessThan
    }
}

public struct FetchAchievementListUseCase {
    private let repository: AchievementListRepositoryProtocol
    
    public init(repository: AchievementListRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(
        requestValue: FetchAchievementListRequestValue? = nil
    ) async throws -> ([Achievement], FetchAchievementListRequestValue?) {
        return try await repository.fetchAchievementList(requestValue: requestValue)
    }
}
