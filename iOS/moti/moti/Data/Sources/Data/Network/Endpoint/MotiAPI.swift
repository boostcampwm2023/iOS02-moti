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
    case autoLogin(requestValue: AutoLoginRequestValue)
}

extension MotiAPI {
    var version: String {
        return "v1"
    }
    
    var baseURL: String {
        return Bundle.main.object(forInfoDictionaryKey: "BASE_URL") as! String + "/api/v1"
    }
    
    var path: String {
        switch self {
        case .version: return "/operate/policy"
        case .login: return "/auth/login"
        case .autoLogin: return "/auth/refresh"
        }
    }
    
    var method: HttpMethod {
        switch self {
        case .version: return .get
        case .login: return .post
        case .autoLogin: return .post
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
        case .autoLogin(let requestValue):
            return requestValue
        }
    }
    
    var headers: [String: String]? {
        var header = ["Content-Type": "application/json"]
        
        switch self {
        case .version:
            break
        case .login:
            break
        case .autoLogin:
            // TODO: Keychain Storage로 변경
            if let accessToken = UserDefaults.standard.string(forKey: "accessToken") {
                header["Authorization"] = "Bearer \(accessToken)"
            }
        }
        
        return header
    }
}
