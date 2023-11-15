//
//  NormalButton.swift
//
//
//  Created by Kihyun Lee on 11/15/23.
//

import UIKit

open class NormalButton: UIButton {
    public init(title: String? = nil, image: UIImage? = nil) {
        super.init(frame: .zero)
        setTitle(title, for: .normal)
        setImage(image, for: .normal)
        setupUI()
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
        setTitleColor(.primaryBlue, for: .normal)
        setTitleColor(.normalButtonHighlightColor, for: .highlighted)
    }
}
