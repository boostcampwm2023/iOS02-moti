//
//  UpdateAchievementRepositoryProtocol.swift
//
//
//  Created by Kihyun Lee on 11/30/23.
//

import Foundation

public protocol UpdateAchievementRepositoryProtocol {
    func updateAchievement(requestValue: UpdateAchievementRequestValue) async throws -> Bool
}
