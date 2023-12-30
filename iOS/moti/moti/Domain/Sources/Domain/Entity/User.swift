//
//  User.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import Foundation

public struct UserToken: Equatable {
    public let accessToken: String
    public let refreshToken: String?
    public let user: User
    
    public init(accessToken: String, refreshToken: String?, user: User) {
        self.accessToken = accessToken
        self.refreshToken = refreshToken
        self.user = user
    }
}

public struct User: Hashable {
    public let code: String
    public let avatarURL: URL?
    public let blockedDate: Date?
    
    public init(code: String, avatarURL: URL?, blockedDate: Date?) {
        self.code = code
        self.avatarURL = avatarURL
        self.blockedDate = blockedDate
    }
    
    public init() {
        self.code = ""
        self.avatarURL = nil
        self.blockedDate = nil
    }
}
