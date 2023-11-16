//
//  Endpoint.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

public protocol EndpointProtocol: Requestable { }

public struct Endpoint: EndpointProtocol {
    public var baseURL: String
    public var path: String
    public var method: HttpMethod
    public var queryParameters: Encodable?
    public var bodyParameters: Encodable?
    public var headers: [String: String]?
    
    init(
        baseURL: String,
        path: String = "",
        method: HttpMethod,
        queryParameters: Encodable? = nil,
        bodyParameters: Encodable? = nil,
        headers: [String: String]? = nil
    ) {
        self.baseURL = baseURL
        self.path = path
        self.method = method
        self.queryParameters = queryParameters
        self.bodyParameters = bodyParameters
        self.headers = headers
    }
}

public enum HttpMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
}
