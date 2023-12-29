//
//  BlockedUser.swift
//
//
//  Created by Kihyun Lee on 12/29/23.
//

import Foundation

public struct BlockedUser: Hashable {
    public let user: User
    public var createdAt: Date?
    
    public init(
        user: User,
        createdAt: Date? = nil
    ) {
        self.user = user
        self.createdAt = createdAt
    }
}
