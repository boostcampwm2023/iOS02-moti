//
//  Notification+Extension.swift
//
//
//  Created by 유정주 on 12/3/23.
//

import Foundation

public extension Notification.Name {
    static let accessTokenDidExpired = Notification.Name("accessTokenDidExpired")
    static let logout = Notification.Name("logout")
}
