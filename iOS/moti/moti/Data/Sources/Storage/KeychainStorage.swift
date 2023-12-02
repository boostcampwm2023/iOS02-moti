//
//  KeychainStorage.swift
//
//
//  Created by 유정주 on 12/2/23.
//

import Foundation
import Domain

final class KeychainStorage: KeychainStorageProtocol {
    func read(key: KeychainKey) -> Data? {
        let query = NSDictionary(dictionary: [
            kSecClass: kSecClassGenericPassword,
            kSecAttrAccount: key.rawValue,
            kSecReturnData: true,
            kSecMatchLimit: kSecMatchLimitOne
        ])
        var data: AnyObject?
        _ = withUnsafeMutablePointer(to: &data) {
            SecItemCopyMatching(query, UnsafeMutablePointer($0))
        }
        return data as? Data
    }
    
    func write(key: KeychainKey, data: Data) {
        let query = NSDictionary(dictionary: [
            kSecClass: kSecClassGenericPassword,
            kSecAttrAccount: key.rawValue,
            kSecValueData: data
        ])
        SecItemDelete(query)
        SecItemAdd(query, nil)
    }
    
    func remove(key: KeychainKey) {
        guard let data = read(key: key) else { return }
        let query = NSDictionary(dictionary: [
            kSecClass: kSecClassGenericPassword,
            kSecAttrAccount: key.rawValue,
            kSecValueData: data
        ])
        SecItemDelete(query)
    }
}
