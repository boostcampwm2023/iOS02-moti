//
//  EmojiRepositoryProtocol.swift
//
//
//  Created by 유정주 on 12/6/23.
//

import Foundation

public protocol EmojiRepositoryProtocol {
    func fetchEmojis(achievementId: Int) async throws -> [Emoji]
    func toggleEmoji(achievementId: Int, emojiId: EmojiType) async throws -> Bool
}
