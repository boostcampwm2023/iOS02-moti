//
//  AuthRepositoryProtocol.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import Foundation

public protocol AuthRepositoryProtocol {
    func autoLogin(requestValue: AutoLoginRequestValue) async throws -> UserToken
    func login(requestValue: LoginRequestValue) async throws -> UserToken
    func revoke(requestValue: RevokeRequestValue) async throws -> Bool
}
