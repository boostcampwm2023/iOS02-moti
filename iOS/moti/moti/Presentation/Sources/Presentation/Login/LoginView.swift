//
//  LoginView.swift
//
//
//  Created by 유정주 on 11/12/23.
//

import UIKit
import Design
import AuthenticationServices

final class LoginView: UIView {
    
    // MARK: - Views
    private let logoImageView = {
        let imageView = UIImageView(image: MotiImage.logoBlue)
        imageView.contentMode = .scaleAspectFill
        return imageView
    }()
    
    // 애플 로그인 버튼
    private let appleLoginButton = ASAuthorizationAppleIDButton(type: .default, style: .whiteOutline)
    
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
        backgroundColor = .systemBackground
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
        addSubview(appleLoginButton)
        appleLoginButton.atl
            .size(width: 219, height: 32)
            .centerX(equalTo: self.safeAreaLayoutGuide.centerXAnchor)
            .bottom(equalTo: self.safeAreaLayoutGuide.bottomAnchor, constant: -40)
    }
}
