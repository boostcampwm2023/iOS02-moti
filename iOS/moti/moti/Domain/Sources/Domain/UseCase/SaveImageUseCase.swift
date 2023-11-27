//
//  SaveImageUseCase.swift
//
//
//  Created by 유정주 on 11/27/23.
//

import Foundation

public struct SaveImageRequestValue: RequestValue {
    public let boundary: String
    public let contentType: String
    public let imageData: Data
    
    public init(boundary: String, contentType: String, imageData: Data) {
        self.boundary = boundary
        self.contentType = contentType
        self.imageData = imageData
    }
}

public struct SaveImageUseCase {
    private let repository: ImageRepositoryProtocol
    
    public init(repository: ImageRepositoryProtocol) {
        self.repository = repository
    }
    
    public func excute(requestValue: SaveImageRequestValue) async throws -> (Bool, Int) {
        return try await repository.saveImage(requestValue: requestValue)
    }
}
