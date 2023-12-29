//
//  FetchBlockedUserListDTO.swift
//
//
//  Created by Kihyun Lee on 12/29/23.
//

import Foundation
import Domain

struct FetchBlockedUserListResponseDTO: ResponseDataDTO {
    let success: Bool?
    let message: String?
    let data: FetchBlockedUserListDTO?
}

struct FetchBlockedUserListDTO: Codable {
    let data: [BlockedUserDTO]?
}

struct BlockedUserDTO: Codable {
    let userCode: String
    let avatarUrl: URL?
    let createdAt: Date?
}

extension BlockedUser {
    init(dto: BlockedUserDTO) {
        self.init(
            user: .init(code: dto.userCode, avatarURL: dto.avatarUrl),
            createdAt: dto.createdAt
        )
    }
}
