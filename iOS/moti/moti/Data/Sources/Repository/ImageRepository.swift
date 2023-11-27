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
        let result: (isSuccess: Bool, id: Int) = (true, -1)
        return result
    }
}
