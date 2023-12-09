//
//  AppInfoViewModel.swift
//
//
//  Created by 유정주 on 12/9/23.
//

import Foundation
import Domain
import Data
import Combine

struct AppInfoViewModel {
    enum AppInfoViewModelAction {
        case revoke(identityToken: String, authorizationCode: String)
    }
    
    enum RevokeState {
        case loading
        case finish
        case error(message: String)
    }
    
    // MARK: - Properties
    private let revokeUseCase: RevokeUseCase
    private(set) var revokeState = PassthroughSubject<RevokeState, Never>()
    
    // MARK: - Init
    init(revokeUseCase: RevokeUseCase) {
        self.revokeUseCase = revokeUseCase
    }
    
    func action(_ actions: AppInfoViewModelAction) {
        switch actions {
        case .revoke(let identityToken, let authorizationCode):
            revoke(identityToken: identityToken, authorizationCode: authorizationCode)
        }
    }
}

private extension AppInfoViewModel {
    /// 회원 탈퇴 액션
    func revoke(identityToken: String, authorizationCode: String) {
        Task {
            do {
                revokeState.send(.loading)
                
                let requestValue = RevokeRequestValue(identityToken: identityToken, authorizationCode: authorizationCode)
                let isSuccess = try await revokeUseCase.execute(requestValue: requestValue)
                revokeState.send(.finish)
                
                NotificationCenter.default.post(name: .logout, object: nil)
                KeychainStorage.shared.remove(key: .accessToken)
                KeychainStorage.shared.remove(key: .refreshToken)
            } catch {
                revokeState.send(.error(message: error.localizedDescription))
            }
        }
    }
}
