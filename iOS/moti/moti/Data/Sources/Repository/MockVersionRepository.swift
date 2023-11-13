//
//  MockVersionRepository.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import Foundation
import Domain

struct MockVersionRepository: VersionRepositoryProtocol {
    func fetchVersion() async throws -> Version {
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
        guard let version = responseDTO.data?.toEntity() else { throw NetworkError.decode }
        return version
    }
}
