//
//  TabBarViewController.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Design

final class TabBarViewController: UITabBarController, VibrationViewController {
    
    // MARK: - Views
    let captureButton = CaptureButton()
    private let borderView = UIView()
    
    // MARK: - Properties
    private var tabBarHeight: CGFloat {
        return tabBar.frame.height
    }
    private var isShowing = true
    private var standardOriginY: CGFloat = 0
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        
        captureButton.addTarget(self, action: #selector(captureButtonDidClicked), for: .touchUpInside)
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        standardOriginY = tabBar.frame.origin.y
    }
    
    func setupViewControllers(with viewControllers: [UIViewController]) {
        setViewControllers(viewControllers, animated: false)
    }
    
    // MARK: - Methods
    @objc private func captureButtonDidClicked() {
        vibration(.soft)
    }
    
    /// 탭바를 보일 때 호출
    func showTabBar() {
        guard !isShowing else { return }
        isShowing = true
        
        self.tabBar.isHidden = false
        self.captureButton.isHidden = false
        self.borderView.isHidden = false
        
        // TODO: 홈 -> 상세 -> 편집 -> 취소 -> 홈 시나리오에서
        // 혼자서 tabBar.frame.y가 원상복구 되는 "원인" 찾아야 함
        if tabBar.frame.origin.y == standardOriginY {
            moveDownTabBar()
        }
        
        UIView.animate(withDuration: 0.3, animations: {
            self.moveUpTabBar()
        })
    }
    
    /// 탭바를 숨길 때 호출
    func hideTabBar() {
        guard isShowing else { return }
        isShowing = false
        
        UIView.animate(withDuration: 0.3, animations: {
            self.moveDownTabBar()
        }, completion: { _ in
            if self.isShowing { return }
            self.tabBar.isHidden = true
            self.captureButton.isHidden = true
            self.borderView.isHidden = true
        })
    }
    
    private func moveUpTabBar() {
        tabBar.frame.origin.y -= tabBarHeight
        captureButton.frame.origin.y -= (tabBarHeight + 30)
        borderView.frame.origin.y -= tabBarHeight
    }
    
    private func moveDownTabBar() {
        tabBar.frame.origin.y += tabBarHeight
        captureButton.frame.origin.y += (tabBarHeight + 30)
        borderView.frame.origin.y += tabBarHeight
    }
    
    // 그룹 리스트 화면에서 캡처 버튼을 숨겨야 함
    /// 캡처버튼을 보일 때 사용
    func showCaptureButton() {
        if captureButton.isHidden {
            captureButton.isHidden = false
            UIView.animate(withDuration: 0.2, animations: {
                self.captureButton.alpha = 1
                self.captureButton.transform = .identity
            })
        }
    }
    
    /// 캡처버튼을 숨길 때 사용
    func hideCaptureButton() {
        if !captureButton.isHidden {
            UIView.animate(withDuration: 0.2, animations: {
                self.captureButton.alpha = 0.1
                self.captureButton.transform = CGAffineTransform(scaleX: 0.1, y: 0.1)
            }, completion: { _ in
                self.captureButton.isHidden = true
            })
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
