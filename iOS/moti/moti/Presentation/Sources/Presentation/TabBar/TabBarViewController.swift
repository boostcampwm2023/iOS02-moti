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
    private let captureButton = UIButton()
    private let circleView = UIView()
    
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
        captureButton.addTarget(self, action: #selector(captureButtonTouchDown), for: .touchDown)
        captureButton.addTarget(self, action: #selector(captureButtonTouchUpInside), for: .touchUpInside)
        captureButton.addTarget(self, action: #selector(captureButtonTouchUpOutside), for: .touchUpOutside)
    }
    
    @objc private func captureButtonTouchDown() {
        UIView.animate(withDuration: 0.2) {
            let scale = CGAffineTransform(scaleX: 0.9, y: 0.9)
            self.circleView.transform = scale
        }
    }
    
    @objc private func captureButtonTouchUpInside() {
        tabBarDelegate?.captureButtonDidClicked()
        
        UIView.animate(withDuration: 0.2) {
            self.circleView.transform = .identity
        }
    }
    
    @objc private func captureButtonTouchUpOutside() {
        UIView.animate(withDuration: 0.2) {
            self.circleView.transform = .identity
        }
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
        setupCircleView()
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

        captureButton.backgroundColor = .motiBackground
        captureButton.layer.borderColor = UIColor.primaryBlue.cgColor
        captureButton.layer.borderWidth = 6
        captureButton.layer.cornerRadius = buttonSize / 2
        
        view.addSubview(captureButton)
        captureButton.atl
            .size(width: buttonSize, height: buttonSize)
            .centerX(equalTo: view.centerXAnchor)
            .bottom(equalTo: view.bottomAnchor, constant: -36)
    }
    
    func setupCircleView() {
        circleView.isUserInteractionEnabled = false
        
        let circleSize: CGFloat = 59
        circleView.backgroundColor = .primaryBlue
        circleView.layer.cornerRadius = circleSize / 2
        
        view.addSubview(circleView)
        circleView.atl
            .size(width: circleSize, height: circleSize)
            .center(of: captureButton)
    }
}
