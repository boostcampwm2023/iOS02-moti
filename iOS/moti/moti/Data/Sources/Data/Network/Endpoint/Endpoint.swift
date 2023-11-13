//
//  Endpoint.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

protocol EndpointProtocol: Requestable { }

struct Endpoint: EndpointProtocol {
    private(set) var baseURL: String
    private(set) var path: String
    private(set) var method: HttpMethod
    private(set) var queryParameters: Encodable?
    private(set) var bodyParameters: Encodable?
    private(set) var headers: [String: String]?
    
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

enum HttpMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case patch = "PATCH"
    case delete = "DELETE"
}

