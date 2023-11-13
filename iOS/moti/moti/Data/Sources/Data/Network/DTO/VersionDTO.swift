//
//  VersionDTO.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation
import Domain

struct VersionResponseDTO: ResponseDTO {
    var success: Bool?
    var message: String?
    var data: VersionDTO?
}

struct VersionDTO: Codable {
    let latest: String?
    let required: String?
    let privacyPolicy: String?
    
    func toEntity() -> Version {
        return .init(
            latest: latest ?? "",
            required: required ?? "",
            privacyPolicy: privacyPolicy ?? ""
        )
    }
}

//extension Version {
//    init(dto: VersionDTO) {
//        self.latest = dto.latest ?? ""
//        self.required = dto.required ?? ""
//        self.privacyPolicy = dto.privacyPolicy ?? ""
//    }
//}
