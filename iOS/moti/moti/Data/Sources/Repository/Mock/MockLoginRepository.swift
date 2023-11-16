//
//  MockLoginRepository.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import Foundation
import Domain
import Core

public struct MockLoginRepository: LoginRepositoryProtocol {
    private var json = """
        {
            "success": true,
            "data": {
                "accessToken": "testAccessToken",
                "refreshToken": "testRefreshToken",
                "user": {
                    "userCode": "ABCDEFG",
                    "avatar_url": "https://test.com",
                }
            }
        }
        """
    
    public init() { }
    
    public init(json: String) {
        self.json = json
    }
    
    public func login(requestValue: LoginRequestValue) async throws -> UserToken {
        Logger.info(MotiAPI.login(requestValue: requestValue))
        
        guard let testData = json.data(using: .utf8) else { throw NetworkError.decode }
        let responseDTO = try JSONDecoder().decode(LoginResponseDTO.self, from: testData)
        
        guard let userTokenDTO = responseDTO.data else { throw NetworkError.decode }
        return UserToken(dto: userTokenDTO)
    }
    
    public func autoLogin(requestValue: AutoLoginRequestValue) async throws -> UserToken {
        Logger.info(MotiAPI.autoLogin(requestValue: requestValue))
        
        guard let testData = json.data(using: .utf8) else { throw NetworkError.decode }
        let responseDTO = try JSONDecoder().decode(LoginResponseDTO.self, from: testData)
        
        guard let userTokenDTO = responseDTO.data else { throw NetworkError.decode }
        return UserToken(dto: userTokenDTO)
    }
}
