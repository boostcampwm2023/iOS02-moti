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
    
    func fetchVersion() {
        Task {
            do {
                version = try await fetchVersionUseCase.execute()
                Logger.debug("version: \(String(describing: version))")
            } catch {
                Logger.debug("version error: \(error)")
            }
        }
    }
    
    func fetchToken() {
        // Keychain 저장소로 변경
        if let refreshToken = UserDefaults.standard.string(forKey: "refreshToken") {
            Logger.debug("refreshToken으로 자동 로그인 시도")
            requestAutoLogin(using: refreshToken)
        } else {
            Logger.debug("자동 로그인 실패")
            resetToken()
            isSuccessLogin = false
        }
    }
    
    func requestAutoLogin(using refreshToken: String) {
        Task {
            do {
                let requestValue = AutoLoginRequestValue(refreshToken: refreshToken)
                let token = try await autoLoginUseCase.excute(requestValue: requestValue)
                saveAccessToken(token.accessToken)
                isSuccessLogin = true
            } catch {
                isSuccessLogin = false
                Logger.error(error)
            }
        }
    }
    
    // TODO: UserDefaultsStorage로 변경해서 UseCase로 사용하기
    func saveAccessToken(_ accessToken: String) {
        UserDefaults.standard.setValue(accessToken, forKey: "accessToken")
    }
    
    func resetToken() {
        UserDefaults.standard.removeObject(forKey: "refreshToken")
        UserDefaults.standard.removeObject(forKey: "accessToken")
    }
}
