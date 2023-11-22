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
    case fetchAchievementList(requestValue: FetchAchievementListRequestValue?)
    case fetchCategoryList
}

extension MotiAPI {
    var version: String {
        return "v1"
    }
    
    var baseURL: String {
        return Bundle.main.object(forInfoDictionaryKey: "BASE_URL") as! String + "/api/\(version)"
    }
    
    var path: String {
        switch self {
        case .version: return "/operate/policy"
        case .login: return "/auth/login"
        case .autoLogin: return "/auth/refresh"
        case .fetchAchievementList: return "/achievements"
        case .fetchCategoryList: return "/categories""
        }
    }
    
    var method: HttpMethod {
        switch self {
        case .version: return .get
        case .login: return .post
        case .autoLogin: return .post
        case .fetchAchievementList: return .get
        case .fetchCategoryList: return .get
        }
    }
    
    var queryParameters: Encodable? {
        switch self {
        case .version:
            return nil
        case .login:
            return nil
        case .autoLogin:
            return nil
        case .fetchAchievementList(let requestValue):
            return requestValue
        case .fetchCategoryList:
            return nil
        }
    }
    
    var bodyParameters: Encodable? {
        switch self {
        case .version: 
            return nil
        case .login(let requestValue):
            return requestValue
        case .autoLogin(let requestValue):
            return requestValue
        case .fetchAchievementList:
            return nil
        case .fetchCategoryList:
            return nil
        }
    }
    
    var headers: [String: String]? {
        var header = ["Content-Type": "application/json"]
        
        switch self {
        case .version, .login:
            break
        case .autoLogin, .fetchAchievementList, .fetchCategoryList:
            // TODO: Keychain Storage로 변경
            if let accessToken = UserDefaults.standard.string(forKey: "accessToken") {
                header["Authorization"] = "Bearer \(accessToken)"
            }
        }
        
        return header
    }
}
