//
//  GroupListItem.swift
//
//
//  Created by 유정주 on 11/30/23.
//

import Foundation

public enum GroupGrade: Hashable {
    case leader // 그룹장
    case manager // 관리자
    case participant // 참가자
}

public struct Group: Hashable {
    public let id: Int
    public let name: String
    public var avatarUrl: URL?
    public var continued: Int
    public var lastChallenged: Date?
    public var grade: GroupGrade
    
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
