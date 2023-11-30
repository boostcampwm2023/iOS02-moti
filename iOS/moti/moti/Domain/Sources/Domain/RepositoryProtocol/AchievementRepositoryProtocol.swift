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
}
