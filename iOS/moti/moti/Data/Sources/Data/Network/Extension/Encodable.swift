//
//  Encodable.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

extension Encodable {

    func toDictionary() throws -> [String: Any]? {
        let object = try JSONEncoder().encode(self)
        let dictionary = try JSONSerialization.jsonObject(with: object, options: []) as? [String: Any]
        return dictionary
    }
}
