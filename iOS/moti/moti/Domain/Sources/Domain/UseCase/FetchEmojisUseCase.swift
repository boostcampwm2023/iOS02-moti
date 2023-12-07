//
//  FetchEmojisUseCase.swift
//
//
//  Created by 유정주 on 12/6/23.
//

import Foundation

public struct FetchEmojisUseCase {
    private let repository: EmojiRepositoryProtocol
    
    public init(repository: EmojiRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(achievementId: Int) async throws -> [Emoji] {
        return try await repository.fetchEmojis(achievementId: achievementId)
    }
}
