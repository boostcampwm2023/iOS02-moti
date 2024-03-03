//
//  LaunchView.swift
//  
//
//  Created by Kihyun Lee on 11/9/23.
//

import UIKit
import Design

final class LaunchView: UIView {

    
    // MARK: - Views
    private let logoImageView = {
        let imageView = UIImageView(image: MotiImage.logoWhite)
        imageView.isAccessibilityElement = true
        imageView.accessibilityLabel = "모티 로고"
        imageView.contentMode = .scaleAspectFill
        return imageView
    }()
    
    let progressLabel = {
        let label = UILabel()
        label.font = .medium
        label.textColor = .white
        return label
    }()
    
    private var timer: Timer?
    private var progressMessage: String = ""
    private var dotCount = 0
    
    // MARK: - Init
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    // MARK: - Methods
    func update(progressMessage: String) {
        timer?.invalidate()
        
        self.progressMessage = progressMessage
        progressLabel.text = progressMessage
        timer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
            guard let self else { return }
            dotCount += 1
            if dotCount > 3 { dotCount = 0 }
            let nextText = progressMessage + String(repeating: ".", count: dotCount)
            progressLabel.text = nextText
        }
    }
    
    // MARK: - Setup
    private func setupUI() {
        backgroundColor = .primaryBlue
        setupLogoImageView()
        setupProgressLabel()
    }
    
    private func setupLogoImageView() {
        addSubview(logoImageView)
        logoImageView.atl
            .size(width: 158, height: 65)
            .center(of: self)
    }
    
    private func setupProgressLabel() {
        addSubview(progressLabel)
        progressLabel.atl
            .centerX(equalTo: safeAreaLayoutGuide.centerXAnchor)
            .bottom(equalTo: safeAreaLayoutGuide.bottomAnchor, constant: -40)
    }
}
