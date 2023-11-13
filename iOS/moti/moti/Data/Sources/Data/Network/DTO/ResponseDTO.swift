//
//  ResponseDTO.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

struct ResponseDTO: Codable {
    let success: Bool?
    let message: String?
    let data: [String: Any]?
}
