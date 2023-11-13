//
//  LaunchViewModel.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import Foundation
import Domain

final class LaunchViewModel {
    
    private let fetchVersionUseCase: FetchVersionUseCase
    
    @Published private(set) var version: Version?
    
    init(fetchVersionUseCase: FetchVersionUseCase) {
        self.fetchVersionUseCase = fetchVersionUseCase
    }
    
    func fetchVersion() throws {
        Task {
            version = try await fetchVersionUseCase.execute()
        }
    }
}
