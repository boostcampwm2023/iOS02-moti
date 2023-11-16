//
//  ResponseDTO.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

public protocol ResponseDTO: Decodable, CustomStringConvertible {
    var success: Bool? { get }
    var message: String? { get }
}

public protocol ReponseDataDTO: ResponseDTO {
    associatedtype T: Codable
    var data: T? { get }
}

extension ResponseDTO {
    var description: String {
        return "success: \(success ?? false)\n" +
            "message: \(message ?? "nil")"
    }
}

extension ReponseDataDTO {
    var description: String {
        if let data = data {
            return "success: \(success ?? false)\n" +
                "message: \(message ?? "nil")\n" +
                "data: \(data)"
        } else {
            return "success: \(success ?? false)\n" +
                "message: \(message ?? "nil")"
        }
    }
}
