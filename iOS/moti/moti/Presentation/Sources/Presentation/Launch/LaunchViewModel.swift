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
    enum LaunchViewModelAction {
        case launch
        case autoLogin
    }
    
    enum AutoLoginState {
        case none
        case loading
        case success
        case failed(message: String)
    }
    
    enum VersionState {
        case none
        case loading
        case finish(version: Version)
        case error(message: String)
    }
    
    private let fetchVersionUseCase: FetchVersionUseCase
    private let autoLoginUseCase: AutoLoginUseCase
    
    @Published private(set) var versionState: VersionState = .none
    @Published private(set) var autoLoginState: AutoLoginState = .none
    
    init(
        fetchVersionUseCase: FetchVersionUseCase,
        autoLoginUseCase: AutoLoginUseCase
    ) {
        self.fetchVersionUseCase = fetchVersionUseCase
        self.autoLoginUseCase = autoLoginUseCase
    }
    
    func action(_ action: LaunchViewModelAction) {
        switch action {
        case .launch:
            fetchVersion()
        case .autoLogin:
            if let refreshToken = fetchRefreshToken() {
                Logger.debug("refreshToken으로 자동 로그인 시도")
                requestAutoLogin(using: refreshToken)
            } else {
                Logger.debug("자동 로그인 실패")
                resetToken()
                autoLoginState = .failed(message: "최초 로그인")
            }
        }
    }
    
    private func fetchVersion() {
        Task {
            do {
                versionState = .loading
                
                let version = try await fetchVersionUseCase.execute()
                Logger.debug("version: \(String(describing: version))")
                
                versionState = .finish(version: version)
            } catch {
                Logger.debug("version error: \(error)")
                versionState = .error(message: error.localizedDescription)
            }
        }
    }
    
    private func fetchRefreshToken() -> String? {
        // Keychain 저장소로 변경
        return UserDefaults.standard.string(forKey: "refreshToken")
    }
    
    private func requestAutoLogin(using refreshToken: String) {
        Task {
            do {
                autoLoginState = .loading
                
                let requestValue = AutoLoginRequestValue(refreshToken: refreshToken)
                let token = try await autoLoginUseCase.excute(requestValue: requestValue)
                saveAccessToken(token.accessToken)
                
                autoLoginState = .success
            } catch {
                Logger.error(error)
                autoLoginState = .failed(message: error.localizedDescription)
            }
        }
    }
    
    // TODO: UserDefaultsStorage로 변경해서 UseCase로 사용하기
    private func saveAccessToken(_ accessToken: String) {
        UserDefaults.standard.setValue(accessToken, forKey: "accessToken")
    }
    
    private func resetToken() {
        UserDefaults.standard.removeObject(forKey: "refreshToken")
        UserDefaults.standard.removeObject(forKey: "accessToken")
    }
}
