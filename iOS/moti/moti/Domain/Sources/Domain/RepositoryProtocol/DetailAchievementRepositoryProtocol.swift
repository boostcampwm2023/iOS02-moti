//
//  DetailAchievementRepositoryProtocol.swift
//
//
//  Created by Kihyun Lee on 11/23/23.
//

import Foundation

public protocol DetailAchievementRepositoryProtocol {
    func fetchDetailAchievement(
        requestValue: FetchDetailAchievementRequestValue
    ) async throws -> Achievement
}
