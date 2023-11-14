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
    
    // MARK: - Properties
    private let loginUseCase: LoginUseCase
    @Published private(set) var userToken: UserToken?
    
    // MARK: - Init
    init(loginUseCase: LoginUseCase) {
        self.loginUseCase = loginUseCase
    }
    
    func requestLogin(identityToken: String) {
        Task {
            let requestValue = LoginRequestValue(identityToken: identityToken)
            do {
                userToken = try await loginUseCase.excute(requestValue: requestValue)
            } catch {
                Logger.error(error)
            }
            
        }
    }
}