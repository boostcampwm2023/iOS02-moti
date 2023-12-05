//
//  GroupMember.swift
//
//
//  Created by Kihyun Lee on 12/5/23.
//

import Foundation

public struct GroupMember: Hashable {
    public let user: User
    public var lastChallenged: Date?
    public var grade: GroupGrade
    
    public init(
        user: User,
        lastChallenged: Date? = nil,
        grade: GroupGrade
    ) {
        self.user = user
        self.lastChallenged = lastChallenged
        self.grade = grade
    }
    
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
}
