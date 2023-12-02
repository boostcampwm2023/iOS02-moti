//
//  AutoLoginRequestValue.swift
//
//
//  Created by 유정주 on 11/15/23.
//

import Foundation
import Core

public struct AutoLoginRequestValue: RequestValue {
    public let refreshToken: String
    
    public init(refreshToken: String) {
        self.refreshToken = refreshToken
    }
}

public struct AutoLoginUseCase {
    private let repository: LoginRepositoryProtocol
    private let keychainStorage: KeychainStorageProtocol
    
    public init(
        repository: LoginRepositoryProtocol,
        keychainStorage: KeychainStorageProtocol
    ) {
        self.repository = repository
        self.keychainStorage = keychainStorage
    }
    
    public func excute() async -> Bool {
        guard let refreshTokenData = keychainStorage.read(key: .refreshToken),
              let refreshToken = String(data: refreshTokenData, encoding: .utf8) else {
            resetUserToken()
            return false
        }
        
        let requestValue = AutoLoginRequestValue(refreshToken: refreshToken)
        do {
            let userToken = try await repository.autoLogin(requestValue: requestValue)
            saveUserToken(userToken)
            return true
        } catch {
            Logger.error(error)
            resetUserToken()
            return false
        }
    }
    
    private func saveUserToken(_ userToken: UserToken) {
        guard let accessToken = userToken.accessToken.data(using: .utf8),
              let refreshToken = userToken.refreshToken.data(using: .utf8) else { return }
        keychainStorage.write(key: .accessToken, data: accessToken)
        keychainStorage.write(key: .refreshToken, data: refreshToken)
    }
    
    private func resetUserToken() {
        keychainStorage.remove(key: .accessToken)
        keychainStorage.remove(key: .refreshToken)
    }
}
