//
//  JKImageType.swift
//  
//
//  Created by 유정주 on 12/7/23.
//

import Foundation

public enum JKImageType {
    case thumbnail
    case original
    
    var key: String {
        switch self {
        case .thumbnail: return "th"
        case .original: return "or"
        }
    }
}
