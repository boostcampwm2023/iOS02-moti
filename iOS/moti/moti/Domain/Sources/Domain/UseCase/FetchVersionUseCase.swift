//
//  FetchVersionUseCase.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

public struct FetchVersionUseCase {
    private let repository: VersionRepositoryProtocol
    
    public init(repository: VersionRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute() async throws -> Version {
        return try await repository.fetchVersion()
    }
}
