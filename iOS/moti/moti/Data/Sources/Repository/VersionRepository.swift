//
//  VersionRepository.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation
import Domain

struct VersionRepository: VersionRepositoryProtocol {
    private let provider: ProviderProtocol
    
    init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    func fetchVersion() async throws -> Version {
        let endpoint = MotiAPI.version
        let responseDTO = try await provider.request(with: endpoint, type: VersionResponseDTO.self)
        
        guard let versionDTO = responseDTO.data else { throw NetworkError.decode }
        return Version(dto: versionDTO)
    }
}
