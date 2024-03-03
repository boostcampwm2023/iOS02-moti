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

public struct AchievementListItem {

    public let achievements: [Achievement]
    public let next: FetchAchievementListRequestValue?
    public let category: CategoryItem?
    
    public init(
        achievements: [Achievement],
        next: FetchAchievementListRequestValue? = nil,
        category: CategoryItem? = nil
    ) {
        self.achievements = achievements
        self.next = next
        self.category = category
    }
}

public struct FetchAchievementListUseCase {

    private let repository: AchievementRepositoryProtocol
    
    public init(repository: AchievementRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(
        requestValue: FetchAchievementListRequestValue? = nil
    ) async throws -> AchievementListItem {
        return try await repository.fetchAchievementList(requestValue: requestValue)
    }
}
