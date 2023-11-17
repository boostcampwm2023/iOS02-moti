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
        
        configuration = .plain()
        
        setTitle(title, for: .normal)
        setImage(image, for: .normal)
    }
    
    required public init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    open override func setImage(_ image: UIImage?, for state: UIControl.State) {
        super.setImage(image, for: state)
        
        configuration?.image = image
        configuration?.imagePlacement = .top
        configuration?.imagePadding = 10
    }
    
    open override func setTitle(_ title: String?, for state: UIControl.State) {
        super.setTitle(title, for: state)
        
        configuration?.titleTextAttributesTransformer = UIConfigurationTextAttributesTransformer { incoming in
            var outgoing = incoming
            outgoing.font = UIFont.xsmall
            return outgoing
        }
    }
    
    public func setColor(_ color: UIColor) {
        setTitleColor(color, for: .normal)
        tintColor = color
    }
}
