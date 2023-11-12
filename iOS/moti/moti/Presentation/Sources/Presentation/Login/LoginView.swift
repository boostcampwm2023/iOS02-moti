//
//  LoginView.swift
//
//
//  Created by 유정주 on 11/12/23.
//

import UIKit
import Design

final class LoginView: UIView {
    
    private let logoImageView = {
        let imageView = UIImageView(image: MotiImage.logoBlue)
        imageView.contentMode = .scaleAspectFill
        return imageView
    }()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    private func setupUI() {
        backgroundColor = .systemBackground
        setupLogoImageView()
    }
    
    private func setupLogoImageView() {
        addSubview(logoImageView)
        logoImageView.atl
            .width(constant: 158)
            .height(constant: 65)
            .center(of: self)
    }
}
