//
//  DetailAchievementDTO.swift
//
//
//  Created by Kihyun Lee on 11/23/23.
//

import Foundation
import Domain

struct DetailAchievementResponseDTO: ResponseDataDTO {
    let success: Bool?
    let message: String?
    let data: DetailAchievementDTO?
}

struct DetailAchievementDTO: Codable {
    let id: Int?
    let title: String?
    let content: String?
    let imageUrl: URL?
    let createdAt: Date?
    let category: CategorySimpleDTO?
    let userCode: String?
}

struct CategorySimpleDTO: Codable {
    let id: Int?
    let name: String?
    let achieveCount: Int?
}

extension Achievement {
    init(dto: DetailAchievementDTO) {
        self.init(
            id: dto.id ?? -1,
            category: CategoryItem(
                id: dto.category?.id ?? -1,
                name: dto.category?.name ?? "",
                continued: dto.category?.achieveCount ?? 0,
                lastChallenged: nil
            ),
            title: dto.title ?? "",
            imageURL: dto.imageUrl,
            body: dto.content,
            date: dto.createdAt ?? .now,
            user: User(code: dto.userCode ?? "", avatarURL: nil)
        )
    }
}
