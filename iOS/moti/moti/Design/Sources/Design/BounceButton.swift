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
            isHighlighted ? highlight() : nonhighlight()
        }
    }

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
        layer.borderWidth = 1
                
        setTitleColor(.buttonTitleColor, for: .normal)
        setTitleColor(.bounceButtonHighlightTitleColor, for: .highlighted)
        
        nonhighlight()
    }
    
    private func highlight() {
        backgroundColor = .primaryBlue
        layer.borderColor = UIColor.primaryBlue.cgColor
    }
    
    private func nonhighlight() {
        backgroundColor = .primaryGray
        layer.borderColor = UIColor.primaryDarkGray.cgColor
    }
}
