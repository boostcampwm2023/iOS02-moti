//
//  Requestable.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

public protocol Requestable {
    var baseURL: String { get }
    var path: String { get }
    var method: HttpMethod { get }
    var queryParameters: Encodable? { get }
    var bodyParameters: Encodable? { get }
    var headers: [String: String]? { get }
}

extension Requestable {
    func makeURLRequest() throws -> URLRequest {
        guard let url = try makeURL() else { throw NetworkError.url }
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = method.rawValue
        
        if let bodyParameters {
            let encoder = JSONEncoder()
            encoder.outputFormatting = .prettyPrinted
            let encodedBodyData = try encoder.encode(bodyParameters)
            urlRequest.httpBody = encodedBodyData
        }
        
        headers?.forEach {
            urlRequest.setValue($1, forHTTPHeaderField: $0)
        }
        
        return urlRequest
    }
    
    func makeURL() throws -> URL? {
        guard let url = URL(string: baseURL + path) else {
            throw NetworkError.url
        }
        
        guard var urlComponents = URLComponents(url: url, resolvingAgainstBaseURL: true) else {
            throw NetworkError.components
        }

        // 쿼리 아이템 추가
        var urlQueryItems = [URLQueryItem]()
        if let queryParameters = try queryParameters?.toDictionary() {
            queryParameters.forEach {
                urlQueryItems.append(URLQueryItem(name: $0.key, value: "\($0.value)"))
            }
        }
        urlComponents.queryItems = !urlQueryItems.isEmpty ? urlQueryItems : nil

        return urlComponents.url
    }
    
}
