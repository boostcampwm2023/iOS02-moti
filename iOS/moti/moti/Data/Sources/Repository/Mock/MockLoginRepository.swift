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
    
    public init() { }
    
    public func login(requestValue: LoginRequestValue) async throws -> UserToken {
        Logger.info(MotiAPI.login(requestValue: requestValue))
        
        let json = """
        {
            "success": true,
            "data": {
                "accessToken": "testAccessToken",
                "refreshToken": "testRefreshToken",
                "user": {
                    userCode: "ABCDEFG",
                    avatar_url: "https://test.com",
                }
            }
        }
        """
        
        guard let testData = json.data(using: .utf8) else { throw NetworkError.decode }
        let responseDTO = try JSONDecoder().decode(LoginResponseDTO.self, from: testData)
        
        guard let userTokenDTO = responseDTO.data else { throw NetworkError.decode }
        return UserToken(dto: userTokenDTO)
    }
}
