//
//  UpdateGradeDTO.swift
//
//
//  Created by Kihyun Lee on 12/6/23.
//

import Foundation

struct UpdateGradeResponseDTO: ResponseDataDTO {
    let success: Bool?
    let message: String?
    let data: UpdateGradeDataDTO?
}

struct UpdateGradeDataDTO: Codable {
    let groupId: Int?
    let userCode: String?
    let grade: String?
}
