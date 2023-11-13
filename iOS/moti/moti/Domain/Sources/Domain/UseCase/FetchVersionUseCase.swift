//
//  FetchVersionUseCase.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

struct FetchVersionUseCase {
    private let repository: VersionRepositoryProtocol
    
    init(repository: VersionRepositoryProtocol) {
        self.repository = repository
    }
    
    func execute() async throws -> Version {
        return try await repository.fetchVersion()
    }
}
