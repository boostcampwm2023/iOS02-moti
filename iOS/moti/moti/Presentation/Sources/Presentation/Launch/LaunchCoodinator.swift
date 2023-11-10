//
//  LaunchCoodinator.swift
//
//
//  Created by 유정주 on 11/10/23.
//

import UIKit

public final class LaunchCoodinator {
    public init() { }
    
    public func launch(window: UIWindow) {
        window.rootViewController = LaunchViewController()
        window.makeKeyAndVisible()
    }
}
