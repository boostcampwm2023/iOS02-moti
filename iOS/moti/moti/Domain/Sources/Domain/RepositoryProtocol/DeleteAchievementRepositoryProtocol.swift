//
//  DeleteAchievementRepositoryProtocol.swift
//  
//
//  Created by Kihyun Lee on 11/28/23.
//

import Foundation

public protocol DeleteAchievementRepositoryProtocol {
    func deleteAchievement(
        requestValue: DeleteAchievementRequestValue
    ) async throws -> Int?
}

