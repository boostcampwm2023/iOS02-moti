//
//  ResponseDTO.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

public protocol ResponseDTO: Codable, CustomStringConvertible {

    var success: Bool? { get }
    var message: String? { get }
}

public protocol ResponseDataDTO: ResponseDTO {

    associatedtype T: Codable
    var data: T? { get }
}

extension ResponseDTO {

    var description: String {
        return "success: \(success ?? false)\n" +
            "message: \(message ?? "nil")"
    }
}

extension ResponseDataDTO {

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
