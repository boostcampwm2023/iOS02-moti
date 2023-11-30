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
    private let repository: AchievementRepositoryProtocol
    private let categoryStorage: CategoryStorageProtocol
    
    public init(
        repository: AchievementRepositoryProtocol,
        categoryStorage: CategoryStorageProtocol
    ) {
        self.repository = repository
        self.categoryStorage = categoryStorage
    }
    
    /// 도전 기록 정보를 업데이트 합니다
    /// 카테고리 변경에 따라 CategoryStorage의 카운팅도 진행됩니다.
    public func execute(
        oldAchievement: Achievement,
        requestValue: UpdateAchievementRequestValue
    ) async throws -> (isSuccess: Bool, updatedAchievement: Achievement?) {
        let isSuccess = try await repository.updateAchievement(requestValue: requestValue)
        guard isSuccess else { return (false, nil) }
        
        let newData = requestValue.body
        let toCategoryId = newData.categoryId
        
        guard let fromCategoryId = oldAchievement.category?.id,
              let toCategory = categoryStorage.find(categoryId: toCategoryId),
              let achievementDate = oldAchievement.date else {
            // TODO: 요청 정보가 잘못 됐다는 Error로 변경 예정
            return (false, nil)
        }
        
        categoryStorage.decrease(categoryId: fromCategoryId)
        categoryStorage.increase(categoryId: toCategoryId)
        
        let updatedAchievement = Achievement(
            id: oldAchievement.id,
            category: toCategory,
            title: newData.title,
            imageURL: oldAchievement.imageURL, 
            body: newData.content,
            date: achievementDate
        )
        return (true, updatedAchievement)
    }
}
