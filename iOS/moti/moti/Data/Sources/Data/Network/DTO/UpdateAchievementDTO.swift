//
//  UpdateAchievementDTO.swift
//
//
//  Created by Kihyun Lee on 11/30/23.
//

import Foundation
import Domain

struct UpdateAchievementResponseDTO: ResponseDTO {
    let success: Bool?
    let message: String?
    let data: UpdateAchievementDataDTO?
}

struct UpdateAchievementDataDTO: Codable {
    let id: Int
}

