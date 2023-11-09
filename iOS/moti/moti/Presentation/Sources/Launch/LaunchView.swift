//
//  LaunchView.swift
//  
//
//  Created by Kihyun Lee on 11/9/23.
//

import UIKit
import Design
import AutoLayout

public final class LaunchView: UIView {
    
    private let logoImageView = {
        let imageView = UIImageView(image: UIImage(named: "MotiLogoWhite"))
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
        backgroundColor = .primaryBlue
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
