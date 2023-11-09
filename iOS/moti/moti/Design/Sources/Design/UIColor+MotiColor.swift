//
//  UIColor+MotiColor.swift
//
//
//  Created by 유정주 on 11/9/23.
//

import UIKit

public extension UIColor {
    /// 005CFD. 파란색
    static let primaryBlue = UIColor(resource: .primaryBlue)
    
    /// F9F9F9. 회색
    static let primaryGray = UIColor(resource: .primaryGray)
    
    /// E3E3E3. 짙은 회색
    static let primaryDarkGray = UIColor(resource: .primaryDarkGray)
    
    /// BounceButton의 Normal 상태 Title 색상
    static var buttonTitleColor = UIColor.label
    
    /// BounceButton의 Highlight 상태 Title 색상
    static var bounceButtonHighlightTitleColor = UIColor(resource: .buttonHighlightedTitle)
}
