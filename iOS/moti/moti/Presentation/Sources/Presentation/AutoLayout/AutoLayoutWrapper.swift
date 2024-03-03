//
//  AutoLayoutWrapper.swift
//  
//
//  Created by 유정주 on 11/9/23.
//

import UIKit

struct AutoLayoutWrapper {

    let view: UIView
}

protocol AutoLayoutCompatible: UIView {

    var atl: AutoLayoutWrapper { get }
}

extension AutoLayoutCompatible {

    var atl: AutoLayoutWrapper {
        return AutoLayoutWrapper(view: self)
    }
}

extension UIView: AutoLayoutCompatible { }
