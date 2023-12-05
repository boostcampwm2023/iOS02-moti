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
    private let repository: AchievementRepositoryProtocol
    // 개인이면 주입, 그룹이면 nil -> TODO: 추후 API 변경되면 제거될 가능성 있음
    private let storage: CategoryStorageProtocol?
    
    public init(
        repository: AchievementRepositoryProtocol,
        storage: CategoryStorageProtocol?
    ) {
        self.repository = repository
        self.storage = storage
    }
    
    public func execute(
        requestValue: DeleteAchievementRequestValue,
        categoryId: Int
    ) async throws -> Bool {
        let isSuccess = try await repository.deleteAchievement(requestValue: requestValue)
        if isSuccess {
            storage?.decrease(categoryId: categoryId)
        }
        return isSuccess
    }
}
