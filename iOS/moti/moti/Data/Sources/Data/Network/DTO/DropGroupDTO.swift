//
//  DropGroupDTO.swift
//
//
//  Created by Kihyun Lee on 12/6/23.
//

import Foundation

struct DropGroupDTO: ResponseDataDTO {

    let success: Bool?
    let message: String?
    let data: DropGroupDataDTO?
}

struct DropGroupDataDTO: Codable {

    let userId: Int?
    let groupId: Int?
}
