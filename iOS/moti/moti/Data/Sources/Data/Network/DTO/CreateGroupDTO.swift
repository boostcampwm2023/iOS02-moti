//
//  CreateGroupDTO.swift
//
//
//  Created by 유정주 on 12/4/23.
//

import Foundation
import Domain

struct CreateGroupDTO: ResponseDataDTO {
    let success: Bool?
    let message: String?
    let data: GroupDTO?
}
