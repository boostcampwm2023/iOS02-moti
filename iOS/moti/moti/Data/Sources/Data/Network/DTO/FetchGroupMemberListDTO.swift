//
//  FetchGroupMemberListDTO.swift
//
//
//  Created by Kihyun Lee on 12/5/23.
//

import Foundation
import Domain

struct FetchGroupMemberListResponseDTO: ResponseDataDTO {

    let success: Bool?
    let message: String?
    let data: FetchGroupMemberListDTO?
}

struct FetchGroupMemberListDTO: Codable {

    let data: [GroupMemberDTO]?
}

struct GroupMemberDTO: Codable {

    let userCode: String
    let avatarUrl: URL?
    let lastChallenged: Date?
    let grade: String?
}

extension GroupMember {

    init(dto: GroupMemberDTO) {
        self.init(
            user: .init(code: dto.userCode, avatarURL: dto.avatarUrl),
            lastChallenged: dto.lastChallenged,
            grade: GroupGrade(rawValue: dto.grade ?? "") ?? .participant
        )
    }
}
