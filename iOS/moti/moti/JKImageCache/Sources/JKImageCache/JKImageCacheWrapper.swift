//
//  JKImageCacheWrapper.swift
//
//
//  Created by 유정주 on 12/7/23.
//

import UIKit

public struct JKImageCacheWrapper<Base> {
    public let base: Base
    
    public init(base: Base) {
        self.base = base
    }
}

/// Jeongfisher와 호환 여부
public protocol JKImageCacheCompatible: AnyObject { }

extension JKImageCacheCompatible {
    /// Wrapping Value
    public var jk: JKImageCacheWrapper<Self> {
        return JKImageCacheWrapper(base: self)
    }
}

extension UIImageView: JKImageCacheCompatible { }
