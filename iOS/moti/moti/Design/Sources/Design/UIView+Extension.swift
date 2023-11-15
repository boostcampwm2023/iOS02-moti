//
//  UIView+Extension.swift
//
//
//  Created by 유정주 on 11/15/23.
//

import UIKit

public extension UIView {
    @objc open func applyHighlightUI() {
        backgroundColor = .primaryBlue
        layer.borderColor = UIColor.primaryBlue.cgColor
        layer.borderWidth = 1
    }
    
    @objc open func applyNormalUI() {
        backgroundColor = .primaryGray
        layer.borderColor = UIColor.primaryDarkGray.cgColor
        layer.borderWidth = 1
    }
    
    open func bounceAnimation(
        scale: CGFloat = 0.95,
        duration: CGFloat = 0.08,
        with animation: (() -> Void)? = nil
    ) {
        UIView.animate(withDuration: duration) {
            animation?()
            let scale = CGAffineTransform(scaleX: scale, y: scale)
            self.transform = scale
        }
    }
    
    open func normalAnimation(
        duration: CGFloat = 0.08,
        with animation: (() -> Void)? = nil
    ) {
        UIView.animate(withDuration: duration) {
            animation?()
            self.transform = .identity
        }
    }
}
