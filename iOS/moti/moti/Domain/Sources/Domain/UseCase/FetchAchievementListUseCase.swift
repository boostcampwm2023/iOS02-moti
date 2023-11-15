//
//  FetchAchievementListUseCase.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public struct FetchAchievementListUseCase {
    private let repository: AchievementListRepositoryProtocol
    
    public init(repository: AchievementListRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute() async throws -> [Achievement] {
        return try await repository.fetchAchievementList()
    }
}
