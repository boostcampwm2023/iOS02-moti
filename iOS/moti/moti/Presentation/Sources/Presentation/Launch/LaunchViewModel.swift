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
    @Published private(set) var refreshToken: String?
    
    init(fetchVersionUseCase: FetchVersionUseCase) {
        self.fetchVersionUseCase = fetchVersionUseCase
    }
    
    func fetchVersion() throws {
        Task {
            version = try await fetchVersionUseCase.execute()
        }
    }
    
    func fetchToken() {
        // Keychain 저장소로 변경
        self.refreshToken = UserDefaults.standard.string(forKey: "refreshToken")
        
//        token = UserToken(
//            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyQ29kZSI6Ilk0Q0Y1NDciLCJpYXQiOjE3MDAwNDUzOTMsImV4cCI6MTcwMDA0ODk5M30.PpzAaYuAQ262bZ9Ix0D85578xxRrb08e5SxlwxNr53E",
//            refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyQ29kZSI6Ilk0Q0Y1NDciLCJpYXQiOjE3MDAwNDUzOTMsImV4cCI6MTcwMDY1MDE5M30.H6t0xZyK0OlFurEv9XO25D6ggwdUscIBd5LY4gFXC3g",
//            user: User(code: "Y4CF547", avatarURL: nil)
//        )
    }
    
    func login() {
        
    }
}
