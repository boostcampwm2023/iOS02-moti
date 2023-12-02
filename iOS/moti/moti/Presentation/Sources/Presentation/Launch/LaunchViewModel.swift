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
            requestAutoLogin()
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
    
    private func requestAutoLogin() {
        Task {
            do {
                autoLoginState = .loading
                let isSuccess = try await autoLoginUseCase.excute()
                autoLoginState = isSuccess ? .success : .failed(message: "최초 로그인")
            } catch {
                Logger.error(error)
                autoLoginState = .failed(message: error.localizedDescription)
            }
        }
    }
}
