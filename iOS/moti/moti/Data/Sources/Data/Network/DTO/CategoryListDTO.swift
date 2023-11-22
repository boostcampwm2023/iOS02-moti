//
//  CategoryListDTO.swift
//
//
//  Created by 유정주 on 11/22/23.
//

import Foundation
import Domain

struct CategoryListResponseDTO: ResponseDataDTO {
    let success: Bool?
    let message: String?
    let data: [CategoryDTO]?
}

struct CategoryDTO: Codable {
    let id: Int?
    let name: String?
    let continued: Int?
    let lastChallanged: Date?
}

extension CategoryItem {
    init(dto: CategoryDTO) {
        self.init(
            id: dto.id ?? -1,
            name: dto.name ?? "",
            continued: dto.continued ?? -1,
            lastChallenged: dto.lastChallanged ?? .now
        )
    }
}
