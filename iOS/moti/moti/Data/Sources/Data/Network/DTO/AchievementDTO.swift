//
//  File.swift
//  
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation
import Domain

struct AchievementListResponseDTO: ResponseDataDTO {
    var success: Bool?
    var message: String?
    var data: [AchievementDTO]?
}

struct AchievementDTO: Codable {
    let id: String?
    let category: String?
    let title: String?
    let imageURL: String?
    let body: String?
    let achieveCount: String?
    let date: String?
}

extension Achievement {
    init(dto: AchievementDTO) {
        self.init(
            id: dto.id ?? "",
            category: dto.category ?? "",
            title: dto.title ?? "",
            imageURL: dto.imageURL ?? "",
            body: dto.body ?? "",
            achieveCount: dto.achieveCount ?? "",
            date: dto.date ?? ""
        )
    }
}
