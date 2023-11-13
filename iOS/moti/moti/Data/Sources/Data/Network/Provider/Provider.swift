//
//  Provider.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation
import Combine

protocol ProviderProtocol {
    func request<R: Decodable, E: EndpointProtocol>(with endpoint: E, type: R.Type) async throws -> R
}

struct Provider: ProviderProtocol {
    private let session = URLSession.shared
    
    func request<R: Decodable, E: Requestable>(with endpoint: E, type: R.Type) async throws -> R {
        guard let urlRequest = try? endpoint.makeURLRequest() else {
            throw NetworkError.url
        }
        
        
        let (data, response) = try await session.data(for: urlRequest)
        guard let response = response as? HTTPURLResponse else { throw NetworkError.statusCode }
        switch response.statusCode {
        case 200..<300:
            let output: ResponseDTO = try JSONDecoder().decode(ResponseDTO.self, from: data)
            return 
        default:
            throw NetworkError.statusCode
        }
    }
}

