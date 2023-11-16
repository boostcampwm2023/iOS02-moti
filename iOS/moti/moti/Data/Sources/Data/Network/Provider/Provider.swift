//
//  Provider.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation
import Core

public protocol ProviderProtocol {
    func request<R: ResponseDTO, E: EndpointProtocol>(with endpoint: E, type: R.Type) async throws -> R
}

public struct Provider: ProviderProtocol {
    private let session: URLSession
    
    public init(session: URLSession = URLSession.shared) {
        self.session = session
    }
    
    public func request<R: ResponseDTO, E: Requestable>(with endpoint: E, type: R.Type) async throws -> R {
        Logger.network("[Request]\n\(endpoint)")
        guard let urlRequest = try? endpoint.makeURLRequest() else {
            throw NetworkError.url
        }
        
        let (data, response) = try await session.data(for: urlRequest)
        guard let response = response as? HTTPURLResponse else { throw NetworkError.response }
        
        let body = try JSONDecoder().decode(type, from: data)
        Logger.network("[Response]\n\(body)")
        switch response.statusCode {
        case 200..<300:
            return body
        default:
            throw NetworkError.statusCode(code: response.statusCode, message: body.message ?? "nil")
        }
    }
}
