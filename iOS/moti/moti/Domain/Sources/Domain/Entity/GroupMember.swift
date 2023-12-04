//
//  GroupMember.swift
//
//
//  Created by Kihyun Lee on 12/5/23.
//

import Foundation

public struct GroupMember: Hashable {
    public let userCode: String
    public var avatarUrl: URL?
    public var lastChallenged: Date?
    public var grade: GroupGrade
    
    public init(
        userCode: String,
        avatarUrl: URL? = nil,
        lastChallenged: Date? = nil,
        grade: GroupGrade
    ) {
        self.userCode = userCode
        self.avatarUrl = avatarUrl
        self.lastChallenged = lastChallenged
        self.grade = grade
    }
}
