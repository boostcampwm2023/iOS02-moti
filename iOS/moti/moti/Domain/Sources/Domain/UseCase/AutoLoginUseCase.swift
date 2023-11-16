//
//  AutoLoginRequestValue.swift
//
//
//  Created by 유정주 on 11/15/23.
//

import Foundation

public struct AutoLoginRequestValue: RequestValue {
    public let refreshToken: String
    
    public init(refreshToken: String) {
        self.refreshToken = refreshToken
    }
}

public struct AutoLoginUseCase {
    private let repository: LoginRepositoryProtocol
    
    public init(repository: LoginRepositoryProtocol) {
        self.repository = repository
    }
    
    public func excute(requestValue: AutoLoginRequestValue) async throws -> UserToken {
        return try await repository.autoLogin(requestValue: requestValue)
    }
}
