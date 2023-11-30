//
//  UpdateAchievementUseCase.swift
//
//
//  Created by Kihyun Lee on 11/29/23.
//

import Foundation

public struct UpdateAchievementRequestValue: RequestValue {
    public let id: Int
    public let body: UpdateAchievementRequestBody
    
    public init(id: Int, body: UpdateAchievementRequestBody) {
        self.id = id
        self.body = body
    }
}

public struct UpdateAchievementRequestBody: RequestValue {
    public let title: String
    public let content: String
    public let categoryId: Int
    
    public init(title: String, content: String, categoryId: Int) {
        self.title = title
        self.content = content
        self.categoryId = categoryId
    }
}

public struct UpdateAchievementUseCase {
    private let repository: UpdateAchievementRepositoryProtocol
    
    public init(repository: UpdateAchievementRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(requestValue: UpdateAchievementRequestValue) async throws -> Bool {
        return try await repository.updateAchievement(requestValue: requestValue)
    }
}
