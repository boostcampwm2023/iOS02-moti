//
//  UserDTO.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import Foundation
import Domain

struct LoginResponseDTO: ResponseDataDTO {
    var success: Bool?
    var message: String?
    var data: UserTokenDTO?
}
