//
//  SceneDelegate.swift
//  moti
//
//  Created by 유정주 on 11/8/23.
//

import UIKit
import Presentation
import Core

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    var appCoordinator: AppCoordinator?
    
    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        addNotificationObservers()

        window = UIWindow(windowScene: windowScene)
        
        let rootVC = UINavigationController()
        rootVC.isNavigationBarHidden = true
        appCoordinator = AppCoordinator(rootVC, nil)
        appCoordinator?.start()
        
        window?.rootViewController = rootVC
        window?.makeKeyAndVisible()
    }
}

// MARK: - Notification
extension SceneDelegate {
    private func addNotificationObservers() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(resetWhenAccessTokenDidExpired),
            name: .accessTokenDidExpired,
            object: nil
        )
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(resetWhenLogout),
            name: .logout,
            object: nil
        )
    }

    private func removeNotificationObservers() {
        NotificationCenter.default.removeObserver(
            self,
            name: .accessTokenDidExpired,
            object: nil
        )
        
        NotificationCenter.default.removeObserver(
            self,
            name: .logout,
            object: nil
        )
    }

    @objc private func resetWhenAccessTokenDidExpired() {
        DispatchQueue.main.async {
            guard let window = self.window,
                  let rootNavigationViewController = window.rootViewController as? UINavigationController else { return }
            
            // 모든 화면 없애기
            rootNavigationViewController.viewControllers = []

            // 로그인 화면부터 다시 시작
            let rootVC = UINavigationController()
            rootVC.isNavigationBarHidden = true
            self.appCoordinator = AppCoordinator(rootVC, nil)
            self.appCoordinator?.startWhenExpiredAccessToken()
            
            window.rootViewController = rootVC
        }
    }
    
    @objc private func resetWhenLogout() {
        DispatchQueue.main.async {
            guard let window = self.window,
                  let rootNavigationViewController = window.rootViewController as? UINavigationController else { return }
            
            // 모든 화면 없애기
            rootNavigationViewController.viewControllers = []

            // 로그인 화면부터 다시 시작
            let rootVC = UINavigationController()
            rootVC.isNavigationBarHidden = true
            self.appCoordinator = AppCoordinator(rootVC, nil)
            self.appCoordinator?.startWhenLogout()
            
            window.rootViewController = rootVC
        }
    }
}
