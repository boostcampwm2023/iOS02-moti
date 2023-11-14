//
//  MotiAPI.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation
import Domain

enum MotiAPI: EndpointProtocol {
    case version
    case login(requestValue: LoginRequestValue)
}

extension MotiAPI {
    var version: String {
        return "v1"
    }
    
    var baseURL: String {
        return "https://www.motimate.site"
    }
    
    var path: String {
        switch self {
        case .version: return "/operate/policy"
        case .login: return "/api/\(version)/auth/login"
        }
    }
    
    var method: HttpMethod {
        switch self {
        case .version: return .get
        case .login: return .post
        }
    }
    
    var queryParameters: Encodable? {
        return nil
    }
    
    var bodyParameters: Encodable? {
        switch self {
        case .version: 
            return nil
        case .login(let requestValue):
            return requestValue
        }
    }
    
    var headers: [String: String]? {
        return nil
    }
}

