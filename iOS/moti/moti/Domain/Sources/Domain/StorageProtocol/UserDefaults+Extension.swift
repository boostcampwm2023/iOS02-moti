//
//  UserDefaultsKey.swift
//
//
//  Created by 유정주 on 12/2/23.
//

import Foundation

public enum UserDefaultsKey: String {
    case requiredVersion
    case latestVersion
    case privacyPolicy
}

public extension UserDefaults {
    func saveString(key: UserDefaultsKey, string: String) {
        UserDefaults.standard.setValue(string, forKey: key.rawValue)
    }
    
    func readString(key: UserDefaultsKey) -> String? {
        return UserDefaults.standard.string(forKey: key.rawValue)
    }
    
    func remove(key: UserDefaultsKey) {
        UserDefaults.standard.removeObject(forKey: key.rawValue)
    }
}
