//
//  Provider.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation
import Core
import Domain

public protocol ProviderProtocol {
    func request<R: ResponseDTO, E: EndpointProtocol>(with endpoint: E, type: R.Type) async throws -> R
    func requestMutipartFormData<R: ResponseDTO, E: Requestable>(with endpoint: E, type: R.Type, bodyData: Data) async throws -> R
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

        #if DEBUG
        Logger.network("[Request(\(endpoint.method.rawValue)) \(urlRequest.url!.absoluteString)]")
        if let requestBody = urlRequest.httpBody,
           let jsonString = String(data: requestBody, encoding: .utf8) {
            Logger.network("[요청 데이터]\n\(jsonString)")
        }
        #endif
        
        let (data, response) = try await session.data(for: urlRequest)
        return try parsingResponse(data: data, response: response, type: type)
    }
    
    public func requestMutipartFormData<R: ResponseDTO, E: Requestable>(with endpoint: E, type: R.Type, bodyData: Data) async throws -> R {
        guard let urlRequest = try? endpoint.makeURLRequest() else {
            throw NetworkError.url
        }

        #if DEBUG
        Logger.network("[Multipart Form Data Request(\(endpoint.method.rawValue)) \(urlRequest.url!.absoluteString)]")
        #endif
        
        let (data, response) = try await session.upload(for: urlRequest, from: bodyData)
        return try parsingResponse(data: data, response: response, type: type)
    }
    
    private func parsingResponse<R: ResponseDTO>(data: Data, response: URLResponse, type: R.Type) throws -> R {
        guard let response = response as? HTTPURLResponse else { throw NetworkError.response }

        let statusCode = response.statusCode
        #if DEBUG
        Logger.network("[Response(\(statusCode))]")
        #endif

        let body = try decoder.decode(type, from: data)
        #if DEBUG
        if let encodingData = try? encoder.encode(body),
           let jsonString = String(data: encodingData, encoding: .utf8) {
            Logger.network("[응답 데이터]\n\(jsonString)")
        }
        #endif
        
        switch statusCode {
        case 200..<300:
            return body
        default:
            throw NetworkError.statusCode(code: response.statusCode, message: body.message ?? "nil")
        }
    }
}
