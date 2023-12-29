//
//  BlockingRepositoryProtocol.swift
//
//
//  Created by 유정주 on 12/5/23.
//

import Foundation

public protocol BlockingRepositoryProtocol {
    func blockingUser(userCode: String) async throws -> Bool
    func blockingAchievement(achievementId: Int) async throws -> Bool
    func fetchBlockedUserList() async throws -> [BlockedUser]
}
