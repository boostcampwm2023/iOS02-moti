//
//  PostAchievementUseCase.swift
//
//
//  Created by Kihyun Lee on 11/30/23.
//

import Foundation

public struct PostAchievementRequestValue: RequestValue {
    public let title: String
    public let content: String
    public let categoryId: Int
    public let photoId: Int
    
    public init(title: String, content: String, categoryId: Int, photoId: Int) {
        self.title = title
        self.content = content
        self.categoryId = categoryId
        self.photoId = photoId
    }
}

public struct PostAchievementUseCase {
    private let repository: AchievementRepositoryProtocol
    private let categoryStorage: CategoryStorageProtocol?
    
    public init(
        repository: AchievementRepositoryProtocol,
        categoryStorage: CategoryStorageProtocol?
    ) {
        self.repository = repository
        self.categoryStorage = categoryStorage
    }
    
    public func execute(requestValue: PostAchievementRequestValue) async throws -> Achievement {
        let newAchievement = try await repository.postAchievement(requestValue: requestValue)
        if let category = newAchievement.category {
            categoryStorage?.increase(categoryId: category.id)
        }
        
        return newAchievement
    }
}
