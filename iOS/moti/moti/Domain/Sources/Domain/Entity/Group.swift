//
//  GroupListItem.swift
//
//
//  Created by 유정주 on 11/30/23.
//

import Foundation

public enum GroupGrade: String, CustomStringConvertible {
    case leader = "LEADER"// 그룹장
    case manager = "MANAGER"// 관리자
    case participant = "PARTICIPANT"// 참가자
    
    public var description: String {
        switch self {
        case .leader: return "그룹장"
        case .manager: return "관리자"
        case .participant: return "그룹원"
        }
    }
}

public struct Group: Hashable {
    public let id: Int
    public let name: String
    public var avatarUrl: URL?
    public var continued: Int
    public var lastChallenged: Date?
    public var grade: GroupGrade
    
    public init(
        id: Int,
        name: String,
        avatarUrl: URL?,
        continued: Int,
        lastChallenged: Date?,
        grade: GroupGrade
    ) {
        self.id = id
        self.name = name
        self.avatarUrl = avatarUrl
        self.continued = continued
        self.lastChallenged = lastChallenged
        self.grade = grade
    }
    
    public init(
        id: Int,
        name: String,
        avatarUrl: URL?,
        grade: GroupGrade
    ) {
        self.id = id
        self.name = name
        self.avatarUrl = avatarUrl
        self.continued = 0
        self.lastChallenged = nil
        self.grade = grade
    }
}
