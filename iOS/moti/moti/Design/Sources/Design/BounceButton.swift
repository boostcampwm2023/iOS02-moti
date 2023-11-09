//
//  BounceButton.swift
//
//
//  Created by 유정주 on 11/9/23.
//

import UIKit

open class BounceButton: UIButton {
    open override var isHighlighted: Bool {
        didSet {
            isHighlighted ? hightlightAnimation() : nonhighlightAnimation()
        }
    }
    
    private let animationDuration = 0.08
    
    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    private func setupUI() {
        layer.cornerRadius = CornerRadius.big
        layer.cornerCurve = .continuous
        layer.borderWidth = 1
        
        setTitleColor(.buttonTitleColor, for: .normal)
        setTitleColor(.bounceButtonHighlightTitleColor, for: .highlighted)
        
        updateButtonColor()
    }
    
    private func updateButtonColor() {
        if isHighlighted {
            backgroundColor = .primaryBlue
            layer.borderColor = UIColor.primaryBlue.cgColor
        } else {
            backgroundColor = .primaryGray
            layer.borderColor = UIColor.primaryDarkGray.cgColor
        }
    }
    
    private func hightlightAnimation() {
        UIView.animate(withDuration: animationDuration) {
            self.updateButtonColor()
            
            // 95%로 크기를 줄임
            let scale = CGAffineTransform(scaleX: 0.95, y: 0.95)
            self.transform = scale
        }
    }
    
    private func nonhighlightAnimation() {
        UIView.animate(withDuration: animationDuration) {
            self.updateButtonColor()
            
            // 원래의 크기로 되돌림
            self.transform = .identity
        }
    }
}
