//
//  SaveImageDTO.swift
//
//
//  Created by 유정주 on 11/27/23.
//

import Foundation

struct SaveImageDTO: ResponseDataDTO {

    var success: Bool?
    var message: String?
    var data: ImageDataDTO?
}

struct ImageDataDTO: Codable {

    var id: Int
    var imageURL: URL?
}
