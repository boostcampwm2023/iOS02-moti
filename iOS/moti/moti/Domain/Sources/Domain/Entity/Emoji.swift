//
//  Emoji.swift
//
//
//  Created by 유정주 on 12/6/23.
//

import Foundation

public enum EmojiType: String, Codable {
    case like
    case fire
    case smile
}

extension EmojiType: CustomStringConvertible {
    public var description: String {
        switch self {
        case .like:
            return "👍"
        case .fire:
            return "🔥"
        case .smile:
            return "🥰"
        }
    }
}

public struct Emoji {
    public let id: EmojiType
    public var isSelected: Bool
    public var count: Int
    
    public init(id: EmojiType, isSelected: Bool, count: Int) {
        self.id = id
        self.isSelected = isSelected
        self.count = count
    }
}
