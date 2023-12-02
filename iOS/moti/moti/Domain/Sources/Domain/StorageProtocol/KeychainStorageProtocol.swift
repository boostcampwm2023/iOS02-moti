//
//  KeychainStorageProtocol.swift
//
//
//  Created by 유정주 on 12/2/23.
//

import Foundation

public enum KeychainKey: String {
    case accessToken
    case refreshToken
}

public protocol KeychainStorageProtocol {
    func read(key: KeychainKey) -> Data?
    func write(key: KeychainKey, data: Data)
    func remove(key: KeychainKey)
}
