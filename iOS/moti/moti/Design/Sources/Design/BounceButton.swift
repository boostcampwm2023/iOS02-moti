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
            isHighlighted ? hightlight() : normal()
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
        
        self.applyNormalUI()
    }
    
    private func hightlight() {
        bounceAnimation(with: { [weak self] in
            self?.applyHighlightUI()
        })
    }
    
    private func normal() {
        normalAnimation(with: { [weak self] in
            self?.applyNormalUI()
        })
    }
}
