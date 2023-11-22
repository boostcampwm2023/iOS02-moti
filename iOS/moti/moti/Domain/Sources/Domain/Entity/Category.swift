//
//  Category.swift
//
//
//  Created by 유정주 on 11/22/23.
//

import Foundation

public struct Category: Hashable {
    public let id: Int
    public let name: String
    public let continued: Int
    public let lastChallenged: Date
    
    public init(
        id: Int,
        name: String,
        continued: Int,
        lastChallenged: Date
    ) {
        self.id = id
        self.name = name
        self.continued = continued
        self.lastChallenged = lastChallenged
    }
}
