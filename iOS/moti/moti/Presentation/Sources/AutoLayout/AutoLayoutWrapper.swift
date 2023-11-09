//
//  AutoLayoutWrapper.swift
//  
//
//  Created by 유정주 on 11/9/23.
//

import UIKit

public struct AutoLayoutWrapper {
    let view: UIView
    
    init(view: UIView) {
        self.view = view
    }
}

public protocol AutoLayoutCompatible: UIView {
    var atl: AutoLayoutWrapper { get }
}

public extension AutoLayoutCompatible {
    var atl: AutoLayoutWrapper {
        return AutoLayoutWrapper(view: self)
    }
}

extension UIView: AutoLayoutCompatible { }
