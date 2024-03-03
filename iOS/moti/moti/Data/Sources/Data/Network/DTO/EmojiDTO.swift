//
//  EmojiDTO.swift
//
//
//  Created by 유정주 on 12/6/23.
//

import Foundation
import Domain

struct FetchEmojisDTO: ResponseDataDTO {

    let success: Bool?
    let message: String?
    let data: [EmojiDTO]?
}

struct EmojiDTO: Codable {

    let id: EmojiType
    let isSelected: Bool?
    let count: Int?
}

extension Emoji {

    init(dto: EmojiDTO) {
        self.init(
            id: dto.id,
            isSelected: dto.isSelected ?? false,
            count: dto.count ?? 0
        )
    }
}
