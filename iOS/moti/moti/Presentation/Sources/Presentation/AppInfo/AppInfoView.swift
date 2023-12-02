//
//  AppInfoView.swift
//  
//
//  Created by 유정주 on 12/2/23.
//

import UIKit
import Design
import Domain

final class AppInfoView: UIView {
    
    // MARK: - Views
    private(set) var closeButton = {
        let button = UIButton(type: .system)
        button.setTitle("닫기", for: .normal)
        return button
    }()
    private var iconImageView = {
        let imageView = UIImageView(image: MotiImage.appIcon)
        imageView.contentMode = .scaleAspectFill
        imageView.layer.cornerRadius = CornerRadius.big
        imageView.clipsToBounds = true
        return imageView
    }()
    private var titleLabel = {
        let label = UILabel()
        label.text = "모티"
        label.font = .xlargeBold
        return label
    }()
    private var versionLabel = {
        let label = UILabel()
        label.numberOfLines = 0
        label.font = .medium
        return label
    }()
    private(set) var policyButton = {
        let button = UIButton(type: .system)
        button.setTitle("개인정보처리방침", for: .normal)
        button.titleLabel?.font = UIFont.systemFont(ofSize: 14)
        button.setTitleColor(.systemBlue, for: .normal)
        button.alpha = 0.8
        return button
    }()
    private(set) var updateButton = {
        let button = UIButton(type: .system)
        button.clipsToBounds = true
        button.layer.masksToBounds = true
        button.layer.cornerRadius = 20
        button.titleLabel?.font = .large
        button.backgroundColor = .primaryBlue
        button.setTitleColor(.white, for: .normal)
        
        return button
    }()
    
    // MARK: - Init
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    func configure(with version: Version) {
        versionLabel.text = "현재 버전 : \(version.current)\n최신 버전 : \(version.latest)"
        let buttonTitle = version.canUpdate ? "최신 버전으로 업데이트" : "최신 버전입니다."
        updateButton.setTitle(buttonTitle, for: .normal)
        updateButton.isEnabled = version.canUpdate
    }
}

// MARK: - Setup
private extension AppInfoView {
    func setupUI() {
        setupCloseButton()
        setupIconImage()
        setupTitleLabel()
        setupVersionLabel()
        
        setupUpdateButton()
        setupPolicyButton()
    }
    
    func setupCloseButton() {
        addSubview(closeButton)
        closeButton.atl
            .top(equalTo: safeAreaLayoutGuide.topAnchor, constant: 20)
            .right(equalTo: safeAreaLayoutGuide.rightAnchor, constant: -20)
    }
    
    func setupIconImage() {
        addSubview(iconImageView)
        iconImageView.atl
            .size(width: 120, height: 120)
            .centerX(equalTo: centerXAnchor)
            .top(equalTo: closeButton.bottomAnchor, constant: 20)
    }
    
    func setupTitleLabel() {
        addSubview(titleLabel)
        titleLabel.atl
            .centerX(equalTo: centerXAnchor)
            .top(equalTo: iconImageView.bottomAnchor, constant: 20)
    }
    
    func setupVersionLabel() {
        addSubview(versionLabel)
        versionLabel.atl
            .centerX(equalTo: centerXAnchor)
            .top(equalTo: titleLabel.bottomAnchor, constant: 20)
    }
    
    func setupUpdateButton() {
        addSubview(updateButton)
        updateButton.atl
            .height(constant: 40)
            .centerX(equalTo: centerXAnchor)
            .bottom(equalTo: safeAreaLayoutGuide.bottomAnchor, constant: -20)
            .horizontal(equalTo: safeAreaLayoutGuide, constant: 40)
    }
    
    func setupPolicyButton() {
        addSubview(policyButton)
        policyButton.atl
            .centerX(equalTo: updateButton.centerXAnchor)
            .bottom(equalTo: updateButton.topAnchor, constant: -5)
    }
}
