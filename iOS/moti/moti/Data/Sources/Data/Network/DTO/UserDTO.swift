//
//  UserDTO.swift
//  
//
//  Created by 유정주 on 11/14/23.
//

import Foundation
import Domain

struct UserTokenDTO: Codable {
    let accessToken: String?
    let refreshToken: String?
    let user: UserDTO?
}

struct UserDTO: Codable {
    let userCode: String?
    let avatarUrl: URL?
}

extension UserToken {
    init(dto: UserTokenDTO) {
        self.init(
            accessToken: dto.accessToken ?? "",
            refreshToken: dto.refreshToken,
            user: dto.user != nil ? User(dto: dto.user!) : User())
    }
}

extension User {
    init(dto: UserDTO) {
        self.init(code: dto.userCode ?? "", avatarURL: dto.avatarUrl)
    }
}
