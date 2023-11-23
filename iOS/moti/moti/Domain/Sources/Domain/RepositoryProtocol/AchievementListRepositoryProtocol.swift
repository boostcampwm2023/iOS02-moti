//
//  AchievementListRepositoryProtocol.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public protocol AchievementListRepositoryProtocol {
    func fetchAchievementList(
        requestValue: FetchAchievementListRequestValue?
    ) async throws -> ([Achievement], FetchAchievementListRequestValue?)
}
