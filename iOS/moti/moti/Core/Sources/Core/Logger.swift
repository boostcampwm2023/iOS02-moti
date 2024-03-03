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
        #if DEBUG
        let message = object != nil ? "\(object!)" : "nil"
        os_log(.debug, "%@", message)
        #endif
    }
    
    public static func info<T>(_ object: T?) {
        #if DEBUG
        let message = object != nil ? "\(object!)" : "nil"
        os_log(.info, "%@", message)
        #endif
    }
    
    public static func error<T>(_ object: T?) {
        #if DEBUG
        let message = object != nil ? "\(object!)" : "nil"
        os_log(.error, "%@", message)
        #endif
    }
    
    public static func network<T>(_ object: T?) {
        #if DEBUG
        let message = object != nil ? "\(object!)" : "nil"
        os_log(.debug, "[Network] %@", message)
        #endif
    }
}
