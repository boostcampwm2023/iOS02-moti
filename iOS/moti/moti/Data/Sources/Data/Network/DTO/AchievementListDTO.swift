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
}

struct AchievementListResponseNextDTO: Codable {
    let take: Int?
    let whereIdLessThan: Int?
    let categoryId: Int?
}

struct AchievementSimpleDTO: Codable {
    let id: Int?
    let thumbnailUrl: String?
    let title: String?
}

extension Achievement {
    init(dto: AchievementSimpleDTO) {
        self.init(
            id: dto.id ?? -1,
            title: dto.title ?? "",
            imageURL: URL(string: dto.thumbnailUrl ?? "")
        )
    }
}
