//
//  TabBarViewController.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Design

protocol TabBarViewControllerDelegate: AnyObject {
    func captureButtonDidClicked()
}

final class TabBarViewController: UITabBarController {
    
    // MARK: - Views
    private let captureButton = CaptureButton()
    private let borderView = UIView()
    
    // MARK: - Properties
    weak var tabBarDelegate: TabBarViewControllerDelegate?
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        addTarget()
    }
    
    func setupViewControllers(with viewControllers: [UIViewController]) {
        setViewControllers(viewControllers, animated: false)
    }
    
    // MARK: - Actions
    private func addTarget() {
        captureButton.addTarget(self, action: #selector(captureButtonTouchUpInside), for: .touchUpInside)
    }
    
    @objc private func captureButtonTouchUpInside() {
        tabBarDelegate?.captureButtonDidClicked()
    }

    // MARK: - Methods
    /// 탭바를 보일 때 호출
    func showTabBar() {
        tabBar.isHidden = false
        captureButton.isHidden = false
        borderView.isHidden = false
    }
    
    /// 탭바를 숨길 때 호출
    func hideTabBar() {
        tabBar.isHidden = true
        captureButton.isHidden = true
        borderView.isHidden = true
    }
}

// MARK: - Setup UI
private extension TabBarViewController {
    func setupUI() {
        tabBar.layer.cornerRadius = CornerRadius.big
        tabBar.layer.maskedCorners = [.layerMinXMinYCorner, .layerMaxXMinYCorner]
        tabBar.backgroundColor = .motiBackground
        tabBar.tintColor = .primaryBlue
        
        setupBorderView()
        setupCaptureTabItem()
    }
    
    func setupBorderView() {
        let borderWidth: CGFloat = 1.0
        
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
        view.addSubview(captureButton)
        captureButton.atl
            .size(width: CaptureButton.defaultSize, height: CaptureButton.defaultSize)
            .centerX(equalTo: view.centerXAnchor)
            .bottom(equalTo: view.bottomAnchor, constant: -36)
    }
}
