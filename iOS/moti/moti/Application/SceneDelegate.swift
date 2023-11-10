//
//  SceneDelegate.swift
//  moti
//
//  Created by 유정주 on 11/8/23.
//

import UIKit
import Presentation

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        
        window = UIWindow(windowScene: windowScene)
        
        if let window {
            let launchCoodinator = LaunchCoodinator()
            launchCoodinator.launch(window: window)
        }
    }
}
