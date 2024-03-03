//
//  NetworkError.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

enum NetworkError: LocalizedError {

    case url
    case components
    case encode
    case decode
    case statusCode(code: Int, message: String)
    case response
    case custom(message: String)
    
    var errorDescription: String? {
        switch self {
        case .url: return "URL 생성 에러"
        case .components: return "Components 생성 에러"
        case .encode: return "Encoding 에러"
        case .decode: return "Decoding 에러"
        case .statusCode(let code, let message): return "statusCode(\(code)) 에러: \(message)"
        case .response: return "Response 타입캐스팅 에러"
        case .custom(let message): return message
        }
    }
}
