//
//  VersionDTO.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation
import Domain

struct VersionResponseDTO: ReponseDataDTO, CustomStringConvertible {
    var success: Bool?
    var message: String?
    var data: VersionDTO?
}

struct VersionDTO: Codable {
    let latest: String?
    let required: String?
    let privacyPolicy: String?
}

extension Version {
    init(dto: VersionDTO) {
        self.init(
            latest: dto.latest ?? "",
            required: dto.required ?? "",
            privacyPolicy: dto.privacyPolicy ?? ""
        )
    }
}
