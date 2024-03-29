//
//  FetchGroupListDTO.swift
//
//
//  Created by 유정주 on 12/4/23.
//

import Foundation
import Domain

struct FetchGroupListDTO: ResponseDataDTO {

    let success: Bool?
    let message: String?
    let data: FetchGroupListDataDTO?
}

struct FetchGroupListDataDTO: Codable {

    let data: [GroupDTO]?
}

struct GroupDTO: Codable {

    let id: Int
    let groupCode: String?
    let name: String?
    let avatarUrl: URL?
    let continued: Int?
    let lastChallenged: Date?
    let grade: String?
}

extension Group {

    init(dto: GroupDTO) {
        self.init(
            id: dto.id,
            code: dto.groupCode ?? "",
            name: dto.name ?? "",
            avatarUrl: dto.avatarUrl,
            continued: dto.continued ?? 0,
            lastChallenged: dto.lastChallenged,
            grade: GroupGrade(rawValue: dto.grade ?? "") ?? .participant)
    }
    
    init(dto: GroupDTO, grade: GroupGrade) {
        self.init(
            id: dto.id,
            code: dto.groupCode ?? "",
            name: dto.name ?? "",
            avatarUrl: dto.avatarUrl,
            continued: dto.continued ?? 0,
            lastChallenged: dto.lastChallenged,
            grade: grade)
    }
}
