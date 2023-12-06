//
//  EmojiRepository.swift
//
//
//  Created by 유정주 on 12/6/23.
//

import Foundation
import Domain

public struct EmojiRepository: EmojiRepositoryProtocol {
    private let provider: ProviderProtocol
    private let groupId: Int
    
    public init(provider: ProviderProtocol = Provider(), groupId: Int) {
        self.provider = provider
        self.groupId = groupId
    }
    
    public func fetchEmojis(achievementId: Int) async throws -> [Emoji] {
        return [
            Emoji(id: .like, isSelected: true, count: 1),
            Emoji(id: .fire, isSelected: false, count: 10),
            Emoji(id: .smile, isSelected: false, count: 0)
        ]
    }
    
    public func toggleEmoji(achievementId: Int, emojiId: Domain.EmojiType) async throws -> Bool {
        return true
    }
}
