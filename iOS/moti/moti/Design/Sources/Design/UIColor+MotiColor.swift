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
    
    /// 배경 색상
    static var motiBackground = UIColor(resource: .motiBackground)
    
    /// 일반 버튼이 눌렸을 때 색상
    static var normalButtonHighlightColor = UIColor(resource: .skyBlue)
    
    /// 탭바 아이템과 동일한 회색 색상
    static var tabBarItemGray = UIColor(resource: .tabBarItemGray)
    
    /// 이모지 버튼 count 라벨 새상
    static var emojiButtonTitle = UIColor(resource: .emojiButtonTitle)
}
