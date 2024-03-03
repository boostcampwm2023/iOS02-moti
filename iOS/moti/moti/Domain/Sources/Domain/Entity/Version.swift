//
//  Version.swift
//
//
//  Created by Kihyun Lee on 11/9/23.
//

import Foundation

public struct Version: Equatable {

    public let current: String
    public let latest: String
    public let required: String
    public let privacyPolicy: String
    
    public init(latest: String, required: String, privacyPolicy: String) {
        self.current = (Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String) ?? "0.0.0"
        self.latest = latest
        self.required = required
        self.privacyPolicy = privacyPolicy
    }
}

public extension Version {

    /// 업데이트 가능 여부
    var canUpdate: Bool {
        compareVersion(curruent: current, compare: latest)
    }
    
    /// 강제 업데이트 여부
    var isNeedForcedUpdate: Bool {
        compareVersion(curruent: current, compare: `required`)
    }
    
    private func compareVersion(curruent: String, compare: String) -> Bool {
        let compareResult = curruent.compare(compare, options: .numeric)
        return compareResult == .orderedAscending
    }
}
