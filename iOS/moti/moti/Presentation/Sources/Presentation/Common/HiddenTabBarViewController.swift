//
//  File.swift
//  
//
//  Created by 유정주 on 12/5/23.
//

import UIKit

protocol HiddenTabBarViewController: UIViewController {

    func showTabBar()
    func hideTabBar()
}

extension HiddenTabBarViewController {

    func showTabBar() {
        if let tabBarController = tabBarController as? TabBarViewController {
            tabBarController.showTabBar()
        }
    }
    
    func hideTabBar() {
        if let tabBarController = tabBarController as? TabBarViewController {
            tabBarController.hideTabBar()
        }
    }
}
