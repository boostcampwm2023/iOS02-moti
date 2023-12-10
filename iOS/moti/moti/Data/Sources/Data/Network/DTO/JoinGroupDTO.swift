//
//  JoinGroupDTO.swift
//
//
//  Created by Kihyun Lee on 12/10/23.
//

import Foundation

struct JoinGroupDTO: ResponseDataDTO {
    let success: Bool?
    let message: String?
    let data: JoinGroupDataDTO?
}

struct JoinGroupDataDTO: Codable {
    let groupCode: String?
    let userCode: String?
}
