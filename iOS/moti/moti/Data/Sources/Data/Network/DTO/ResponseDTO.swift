//
//  ResponseDTO.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

protocol ResponseDTO: Codable {
    var success: Bool? { get }
    var message: String? { get }
}
