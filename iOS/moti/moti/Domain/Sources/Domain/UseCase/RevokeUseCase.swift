//
//  RevokeUseCase.swift
//
//
//  Created by 유정주 on 12/9/23.
//

import Foundation

public struct RevokeRequestValue: RequestValue {

    public let identityToken: String
    public let authorizationCode: String
    
    public init(identityToken: String, authorizationCode: String) {
        self.identityToken = identityToken
        self.authorizationCode = authorizationCode
    }
}

public struct RevokeUseCase {

    private let repository: AuthRepositoryProtocol
    
    public init(repository: AuthRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(requestValue: RevokeRequestValue) async throws -> Bool {
        return try await repository.revoke(requestValue: requestValue)
    }
}
