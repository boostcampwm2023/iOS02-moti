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
    private let keychainStorage: KeychainStorageProtocol
    
    public init(
        repository: LoginRepositoryProtocol,
        keychainStorage: KeychainStorageProtocol
    ) {
        self.repository = repository
        self.keychainStorage = keychainStorage
    }

    public func excute(requestValue: LoginRequestValue) async throws -> Bool {
        let userToken = try await repository.login(requestValue: requestValue)
        saveUserToken(userToken)
        
        return true
    }
    
    private func saveUserToken(_ userToken: UserToken) {
        guard let accessToken = userToken.accessToken.data(using: .utf8),
              let refreshToken = userToken.refreshToken.data(using: .utf8) else { return }
        keychainStorage.write(key: .accessToken, data: accessToken)
        keychainStorage.write(key: .refreshToken, data: refreshToken)
    }
}
