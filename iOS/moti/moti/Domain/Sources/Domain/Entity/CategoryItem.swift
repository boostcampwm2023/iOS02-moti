//
//  Category.swift
//
//
//  Created by 유정주 on 11/22/23.
//

import Foundation

// Category는 이미 있는 타입이라 ambiguous 에러 뜸. (Domain.Category로 사용할 수 있지만 번거로움)
// 그래서 뒤에 Item 붙임
public struct CategoryItem: Hashable {
    public let id: Int
    public let name: String
    public let continued: Int
    public let lastChallenged: Date?
    
    private let dateFormatter = {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        return dateFormatter
    }()
    
    public var displayLastChallenged: String {
        if let lastChallenged {
            return dateFormatter.string(from: lastChallenged)
        } else {
            return "없음"
        }
    }
    
    public init(
        id: Int,
        name: String,
        continued: Int,
        lastChallenged: Date?
    ) {
        self.id = id
        self.name = name
        self.continued = continued
        self.lastChallenged = lastChallenged
    }
    
    public init(
        id: Int,
        name: String
    ) {
        self.id = id
        self.name = name
        self.continued = 0
        self.lastChallenged = nil
    }
}
