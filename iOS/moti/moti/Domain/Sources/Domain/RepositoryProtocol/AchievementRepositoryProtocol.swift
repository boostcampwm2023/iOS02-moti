//
//  AchievementRepositoryProtocol.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public protocol AchievementRepositoryProtocol {
    func fetchAchievementList(
        requestValue: FetchAchievementListRequestValue?
    ) async throws -> AchievementListItem
    
    func deleteAchievement(
        achievementId: Int
    ) async throws -> Bool
    
    func fetchDetailAchievement(
        requestValue: FetchDetailAchievementRequestValue
    ) async throws -> Achievement
    
    func updateAchievement(
        requestValue: UpdateAchievementRequestValue
    ) async throws -> Bool
    
    func postAchievement(
        requestValue: PostAchievementRequestValue
    ) async throws -> Achievement
}

public protocol GroupAchievementRepositoryProtocol: AchievementRepositoryProtocol {
    var groupId: Int { get }
}
