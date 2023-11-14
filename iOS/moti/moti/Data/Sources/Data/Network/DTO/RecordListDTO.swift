//
//  File.swift
//  
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation
import Domain

struct RecordListResponseDTO: ResponseDTO {
    var success: Bool?
    var message: String?
    var data: [RecordDTO]?
}

struct RecordDTO: Codable {
    let id: String?
    let category: String?
    let title: String?
    let imageURL: String?
    let body: String?
    let achieveCount: String?
    let date: String?
}

extension Record {
    init(dto: RecordDTO) {
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

