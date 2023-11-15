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
        setTitleColor(.primaryBlue, for: .normal)
        setTitleColor(.normalButtonHighlightColor, for: .highlighted)
        configuration = .plain()
        configuration?.imagePlacement = .top
        configuration?.imagePadding = 10
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
    }
    
    public func setColor(_ color: UIColor) {
        setTitleColor(color, for: .normal)
        tintColor = color
    }
}
