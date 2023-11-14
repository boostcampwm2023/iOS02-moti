//
//  LoginUseCase.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import Foundation

public struct LoginRequestValue: RequestValue {
    public let identityToken: String
    
    public init(identityToken: String) {
        self.identityToken = identityToken
    }
}

public struct LoginUseCase {
    private let repository: LoginRepositoryProtocol
    
    public init(repository: LoginRepositoryProtocol) {
        self.repository = repository
    }
    
    public func excute(requestValue: LoginRequestValue) async throws -> UserToken {
        return try await repository.login(requestValue: requestValue)
    }
}
