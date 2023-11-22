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
    private let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .prettyPrinted
        return encoder
    }()
    private let decoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()
    
    public init(session: URLSession = URLSession.shared) {
        self.session = session
    }
    
    public func request<R: ResponseDTO, E: Requestable>(with endpoint: E, type: R.Type) async throws -> R {
        guard let urlRequest = try? endpoint.makeURLRequest() else {
            throw NetworkError.url
        }

        Logger.network("[Request(\(endpoint.method.rawValue)) \(endpoint.path)]")
        if let requestBody = urlRequest.httpBody,
           let jsonString = String(data: requestBody, encoding: .utf8) {
            Logger.network("[요청 데이터]\n\(jsonString)")
        }
        
        let (data, response) = try await session.data(for: urlRequest)
        guard let response = response as? HTTPURLResponse else { throw NetworkError.response }
        
        let statusCode = response.statusCode
        let body = try decoder.decode(type, from: data)
        
        Logger.network("[Response(\(statusCode))]")
        if let encodingData = try? encoder.encode(body),
           let jsonString = String(data: encodingData, encoding: .utf8) {
            Logger.network("[응답 데이터]\n\(jsonString)")
        }
        
        switch statusCode {
        case 200..<300:
            return body
        default:
            throw NetworkError.statusCode(code: response.statusCode, message: body.message ?? "nil")
        }
    }
}
