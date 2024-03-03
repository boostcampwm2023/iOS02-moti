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
        let version = try await repository.fetchVersion()
        saveVersion(version)
        return version
    }
    
    private func saveVersion(_ version: Version) {
        UserDefaults.standard.saveString(key: .requiredVersion, string: version.required)
        UserDefaults.standard.saveString(key: .latestVersion, string: version.latest)
        UserDefaults.standard.saveString(key: .privacyPolicy, string: version.privacyPolicy)
    }
}
