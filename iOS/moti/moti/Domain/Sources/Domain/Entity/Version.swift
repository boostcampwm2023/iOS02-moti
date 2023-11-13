//
//  Version.swift
//
//
//  Created by Kihyun Lee on 11/9/23.
//

import Foundation

public struct Version: Equatable {
    public let latest: String
    public let required: String
    public let privacyPolicy: String
    
    public init(latest: String, required: String, privacyPolicy: String) {
        self.latest = latest
        self.required = required
        self.privacyPolicy = privacyPolicy
    }
}
