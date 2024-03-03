//
//  ImageRepository.swift
//
//
//  Created by 유정주 on 11/27/23.
//

import Foundation
import Domain

public struct ImageRepository: ImageRepositoryProtocol {

    private let provider: ProviderProtocol
    
    public init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    public func saveImage(requestValue: SaveImageRequestValue) async throws -> (Bool, Int) {
        let endpoint = MotiAPI.saveImage(requestValue: requestValue)
        let bodyData = endpoint.makeMultipartFormDataBody(
            boundary: requestValue.boundary,
            contentType: requestValue.contentType,
            data: requestValue.imageData
        )
        let responseDTO = try await provider.requestMutipartFormData(with: endpoint, type: SaveImageDTO.self, bodyData: bodyData)
        
        guard let imageDTO = responseDTO.data else { throw NetworkError.decode }
        return (responseDTO.success ?? false, imageDTO.id)
    }
}
