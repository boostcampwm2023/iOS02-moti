//
//  LoginRepository.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import Foundation
import Domain

struct LoginRepository: LoginRepositoryProtocol {
    private let provider: ProviderProtocol
    
    init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    func login(requestValue: LoginRequestValue) async throws -> UserToken {
        let endpoint = MotiAPI.login(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: LoginResponseDTO.self)
        
        guard let userTokenDTO = responseDTO.data else { throw NetworkError.decode }
        return UserToken(dto: userTokenDTO)
    }
    
    func autoLogin(requestValue: AutoLoginRequestValue) async throws -> UserToken {
        let endpoint = MotiAPI.autoLogin(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: LoginResponseDTO.self)
        
        guard let userTokenDTO = responseDTO.data else { throw NetworkError.decode }
        return UserToken(dto: userTokenDTO)
    }
}
