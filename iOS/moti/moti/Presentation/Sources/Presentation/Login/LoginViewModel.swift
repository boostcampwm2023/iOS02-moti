//
//  LoginViewModel.swift
//
//
//  Created by 유정주 on 11/14/23.
//

import Foundation
import Core
import Domain

final class LoginViewModel {
    
    enum LoginViewModelAction {
        case login(identityToken: String)
    }
    
    enum LoginState {
        case none
        case loading
        case success
        case failed
        case error(message: String)
    }
    
    // MARK: - Properties
    private let loginUseCase: LoginUseCase
    @Published private(set) var loginState: LoginState = .none
    
    // MARK: - Init
    init(loginUseCase: LoginUseCase) {
        self.loginUseCase = loginUseCase
    }
    
    func action(_ actions: LoginViewModelAction) {
        switch actions {
        case .login(let identityToken):
            requestLogin(identityToken: identityToken)
        }
    }
    
    private func requestLogin(identityToken: String) {
        Task {
            do {
                loginState = .loading
                
                let requestValue = LoginRequestValue(identityToken: identityToken)
                let isSuccess = try await loginUseCase.excute(requestValue: requestValue)
                loginState = isSuccess ? .success : .failed
            } catch {
                loginState = .error(message: error.localizedDescription)
            }
        }
    }
}
