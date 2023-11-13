//
//  MotiAPI.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

enum MotiAPI: EndpointProtocol {
    case version
}

extension MotiAPI {
    var baseURL: String {
        return ""
    }
    
    var path: String {
        switch self {
        case .version: return "/operate/policy"
        }
    }
    
    var method: HttpMethod {
        switch self {
        case .version: return .get
        }
    }
    
    var queryParameters: Encodable? {
        return nil
    }
    
    var bodyParameters: Encodable? {
        switch self {
        case .version: return nil
        }
    }
    
    var headers: [String: String]? {
        return nil
    }
}

