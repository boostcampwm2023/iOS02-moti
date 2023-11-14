//
//  TabBarViewController.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Design

final class TabBarViewController: UITabBarController {
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    func setupViewControllers(with viewControllers: [UIViewController]) {
        setViewControllers(viewControllers, animated: false)
    }
    
    // MARK: - Actions
    @objc private func captureTabItemClicked() {
        selectedIndex = 1
    }
}

// MARK: - Setup UI

private extension TabBarViewController {
    func setupUI() {
        tabBar.layer.cornerRadius = CornerRadius.big
        tabBar.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
        tabBar.backgroundColor = .motiBackground
        
        setupBorderView()
        setupCaptureTabItem()
    }
    
    func setupBorderView() {
        let borderWidth: CGFloat = 1.0
        let borderView = UIView(frame: .zero)
        
        borderView.backgroundColor = .gray
        borderView.alpha = 0.3
        borderView.layer.cornerRadius = CornerRadius.big
        borderView.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]

        view.addSubview(borderView)
        borderView.atl
            .size(width: tabBar.frame.width + borderWidth, height: tabBar.frame.height + borderWidth)
            .centerX(equalTo: view.centerXAnchor)
            .bottom(equalTo: view.safeAreaLayoutGuide.bottomAnchor)
        view.bringSubviewToFront(tabBar)
    }
    
    func setupCaptureTabItem() {
        let buttonSize: CGFloat = 75
        let button = UIButton(frame: .zero)
        
        button.backgroundColor = .primaryBlue
        button.layer.cornerRadius = buttonSize / 2
        
        view.addSubview(button)
        button.atl
            .size(width: buttonSize, height: buttonSize)
            .centerX(equalTo: view.centerXAnchor)
            .bottom(equalTo: view.bottomAnchor, constant: -36)
        
        button.addTarget(self, action: #selector(captureTabItemClicked), for: .touchUpInside)
    }
}
