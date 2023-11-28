//
//  DeleteAchievementDTO.swift
//
//
//  Created by Kihyun Lee on 11/28/23.
//

import Foundation
import Domain

struct DeleteAchievementResponseDTO: ResponseDTO {
    let success: Bool?
    let message: String?
    let data: DeleteAchievementDataDTO?
}

struct DeleteAchievementDataDTO: Codable {
    let id: Int
}
