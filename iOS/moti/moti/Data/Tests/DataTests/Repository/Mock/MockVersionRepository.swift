//
//  MockVersionRepository.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import Foundation
@testable import Domain
@testable import Data

public struct MockVersionRepository: VersionRepositoryProtocol {
    
    public init() { }
    
    public func fetchVersion() async throws -> Version {
        let json = """
        {
            "success": true,
            "message": "성공 메시지 예시",
            "data": {
                "latest": "0.0.0",
                "required": "0.0.0",
                "privacyPolicy": "https://motimate.site/pivacy"
            }
        }
        """
        
        guard let testData = json.data(using: .utf8) else { throw NetworkError.decode }
        let responseDTO = try JSONDecoder().decode(VersionResponseDTO.self, from: testData)
        
        guard let versionDTO = responseDTO.data else { throw NetworkError.decode }
        return Version(dto: versionDTO)
    }
}
