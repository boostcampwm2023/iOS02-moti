//
//  Logger.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import Foundation
import OSLog

public enum Logger {
    public static func debug<T>(_ object: T?) {
        let message = object != nil ? "\(object!)" : "nil"
        os_log(.debug, "%@", message)
    }
    
    public static func info<T>(_ object: T?) {
        let message = object != nil ? "\(object!)" : "nil"
        os_log(.info, "%@", message)
    }
    
    public static func error<T>(_ object: T?) {
        let message = object != nil ? "\(object!)" : "nil"
        os_log(.error, "%@", message)
    }
    
    public static func network<T>(_ object: T?) {
        let message = object != nil ? "\(object!)" : "nil"
        os_log(.debug, "[Network] %@", message)
    }
}
