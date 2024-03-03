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
        let endpoint = MotiAPI.fetchEmojis(achievementId: achievementId, groupId: groupId)
        let responseDTO = try await provider.request(with: endpoint, type: FetchEmojisDTO.self)
        
        guard let emojis = responseDTO.data else { throw NetworkError.decode }
        
        return emojis.map { Emoji(dto: $0) }
    }
    
    public func toggleEmoji(achievementId: Int, emojiId: EmojiType) async throws -> Bool {
        let endpoint = MotiAPI.toggleEmoji(achievementId: achievementId, groupId: groupId, emojiId: emojiId.rawValue)
        let responseDTO = try await provider.request(with: endpoint, type: SimpleResponseDTO.self)
        
        return responseDTO.success ?? false
    }
}
