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
    ) async throws -> ([Achievement], FetchAchievementListRequestValue?)
    
    func deleteAchievement(
        requestValue: DeleteAchievementRequestValue
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

public protocol GroupAchievementRepositoryProtocol {
    func fetchAchievementList(
        requestValue: FetchAchievementListRequestValue?,
        groupId: Int
    ) async throws -> ([Achievement], FetchAchievementListRequestValue?)
    
    func deleteAchievement(
        requestValue: DeleteAchievementRequestValue,
        groupId: Int
    ) async throws -> Bool
    
    func fetchDetailAchievement(
        requestValue: FetchDetailAchievementRequestValue,
        groupId: Int
    ) async throws -> Achievement
    
    func updateAchievement(
        requestValue: UpdateAchievementRequestValue,
        groupId: Int
    ) async throws -> Bool
    
    func postAchievement(
        requestValue: PostAchievementRequestValue,
        groupId: Int
    ) async throws -> Achievement
}
