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
    let thumbnailUrl: URL?
    let title: String?
    
    init(id: Int?, thumbnailUrl: URL?, title: String?) {
        self.id = id
        self.thumbnailUrl = thumbnailUrl
        self.title = title
    }
    
    init(dto: DetailAchievementDTO) {
        self.init(
            id: dto.id,
            thumbnailUrl: dto.imageUrl,
            title: dto.title
        )
    }
}

extension Achievement {
    init(dto: AchievementSimpleDTO) {
        self.init(
            id: dto.id ?? -1,
            title: dto.title ?? "",
            imageURL: dto.thumbnailUrl
        )
    }
}
