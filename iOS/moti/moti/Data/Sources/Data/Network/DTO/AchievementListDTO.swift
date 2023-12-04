//
//  AchievementListDTO.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation
import Domain

struct AchievementListResponseDTO: ResponseDataDTO {
    let success: Bool?
    let message: String?
    let data: AchievementListResponseDataDTO?
}

struct AchievementListResponseDataDTO: Codable {
    let data: [AchievementSimpleDTO]?
    let count: Int?
    let next: AchievementListResponseNextDTO?
    let category: CategoryDTO?
}

struct AchievementListResponseNextDTO: Codable {
    let take: Int?
    let whereIdLessThan: Int?
    let categoryId: Int?
}

struct AchievementSimpleDTO: Codable {
    let id: Int
    let thumbnailUrl: URL?
    let title: String
    let categoryId: Int
    let userCode: String?
}

extension Achievement {
    init(dto: AchievementSimpleDTO) {
        self.init(
            id: dto.id,
            title: dto.title,
            imageURL: dto.thumbnailUrl,
            categoryId: dto.categoryId,
            userCode: dto.userCode
        )
    }
}
