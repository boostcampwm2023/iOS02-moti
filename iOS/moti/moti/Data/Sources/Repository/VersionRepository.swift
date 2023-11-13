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
    }
    
}
