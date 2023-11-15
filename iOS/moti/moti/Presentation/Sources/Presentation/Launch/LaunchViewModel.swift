//
//  LaunchViewModel.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import Foundation
import Domain
import Core

final class LaunchViewModel {
    
    private let fetchVersionUseCase: FetchVersionUseCase
    private let autoLoginUseCase: AutoLoginUseCase
    
    @Published private(set) var version: Version?
    @Published private(set) var isSuccessLogin = false
    private var token: UserToken?
    
    init(
        fetchVersionUseCase: FetchVersionUseCase,
        autoLoginUseCase: AutoLoginUseCase
    ) {
        self.fetchVersionUseCase = fetchVersionUseCase
        self.autoLoginUseCase = autoLoginUseCase
    }
    
    func fetchVersion() throws {
        Task {
            version = try await fetchVersionUseCase.execute()
            Logger.debug("version: \(String(describing: version))")
        }
    }
    
    func fetchToken() {
        // Keychain 저장소로 변경
        if let refreshToken = UserDefaults.standard.string(forKey: "refreshToken") {
            Logger.debug("refreshToken으로 자동 로그인 시도")
            requestAutoLogin(using: refreshToken)
        } else {
            Logger.debug("자동 로그인 실패")
            isSuccessLogin = false
        }
    }
    
    func requestAutoLogin(using refreshToken: String) {
        Task {
            do {
                let requestValue = AutoLoginRequestValue(refreshToken: refreshToken)
                let token = try await autoLoginUseCase.excute(requestValue: requestValue)
                saveToken(token)
                isSuccessLogin = true
            } catch {
                isSuccessLogin = false
                Logger.error(error)
            }
        }
    }
    
    // TODO: UserDefaultsStorage로 변경해서 UseCase로 사용하기
    func saveToken(_ token: UserToken) {
        UserDefaults.standard.setValue(token.refreshToken, forKey: "refreshToken")
        UserDefaults.standard.setValue(token.accessToken, forKey: "accessToken")
    }
    
    func resetToken() {
        UserDefaults.standard.removeObject(forKey: "refreshToken")
        UserDefaults.standard.removeObject(forKey: "accessToken")
    }
}
