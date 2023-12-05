//
//  GroupListItem.swift
//
//
//  Created by 유정주 on 11/30/23.
//

import Foundation

public enum GroupGrade: Hashable, CustomStringConvertible {
    case leader // 그룹장
    case manager // 관리자
    case participant // 참가자
    
    public init?(grade: String) {
        switch grade {
        case "LEADER": self = .leader
        case "MANAGER": self = .manager
        case "PARTICIPANT": self = .participant
        default: return nil
        }
    }
    
    public var description: String {
        switch self {
        case .leader: return "그룹장"
        case .manager: return "관리자"
        case .participant: return "참가자"
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
