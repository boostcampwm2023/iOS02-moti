//
//  ToggleEmojiUseCase.swift
//  
//
//  Created by 유정주 on 12/6/23.
//

import Foundation

public struct ToggleEmojiUseCase {

    private let repository: EmojiRepositoryProtocol
    
    public init(repository: EmojiRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(achievementId: Int, emojiId: EmojiType) async throws -> Bool {
        return try await repository.toggleEmoji(achievementId: achievementId, emojiId: emojiId)
    }
}
