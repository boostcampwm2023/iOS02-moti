//
//  LoginRepository.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import Foundation
import Domain
import Core

public struct LoginRepository: LoginRepositoryProtocol {
    private let provider: ProviderProtocol
    
    public init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    public func login(requestValue: LoginRequestValue) async throws -> UserToken {
        let endpoint = MotiAPI.login(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: LoginResponseDTO.self)
        
        guard let userTokenDTO = responseDTO.data else { throw NetworkError.decode }
        return UserToken(dto: userTokenDTO)
    }
    
    public func autoLogin(requestValue: AutoLoginRequestValue) async throws -> UserToken {
        let endpoint = MotiAPI.autoLogin(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: LoginResponseDTO.self)
        
        guard let userTokenDTO = responseDTO.data else { throw NetworkError.decode }
        return UserToken(dto: userTokenDTO)
    }
}
