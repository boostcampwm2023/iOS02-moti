//
//  LoginView.swift
//
//
//  Created by 유정주 on 11/12/23.
//

import UIKit
import Design

final class LoginView: UIView {

    
    // MARK: - Views
    private let logoImageView = {
        let imageView = UIImageView(image: MotiImage.logoBlue)
        imageView.isAccessibilityElement = true
        imageView.accessibilityLabel = "모티 로고"
        imageView.contentMode = .scaleAspectFill
        return imageView
    }()
    
    // 애플 로그인 버튼
    let appleLoginButton = AuthButtonFactory.makeAppleLoginButton()
    
    // MARK: - Init
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    // MARK: - Setup
    private func setupUI() {
        setupLogoImageView()
        setupAppleIDButton()
    }
    
    private func setupLogoImageView() {
        addSubview(logoImageView)
        logoImageView.atl
            .size(width: 158, height: 65)
            .center(of: self)
    }
    
    private func setupAppleIDButton() {
        let ratio = 6.8
        let loginButtonHeight = 48.0
        appleLoginButton.setValue(loginButtonHeight / 2, forKey: "cornerRadius")

        addSubview(appleLoginButton)
        appleLoginButton.atl
            .size(width: loginButtonHeight * ratio, height: loginButtonHeight)
            .centerX(equalTo: self.safeAreaLayoutGuide.centerXAnchor)
            .bottom(equalTo: self.safeAreaLayoutGuide.bottomAnchor, constant: -40)
    }
}
