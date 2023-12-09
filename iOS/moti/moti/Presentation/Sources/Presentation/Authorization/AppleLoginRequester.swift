//
//  AppleLoginRequester.swift
//
//
//  Created by 유정주 on 11/12/23.
//

import Foundation
import AuthenticationServices
import Core

protocol AppleLoginRequesterDelegate: AnyObject {
    func success(token: String)
    func failed(message: String)
}

final class AppleLoginRequester: NSObject, LoginRequester {
    
    private var window: UIWindow
    weak var delegate: AppleLoginRequesterDelegate?
    
    init(window: UIWindow) {
        self.window = window
    }
    
    func request() {
        let provider = ASAuthorizationAppleIDProvider()
        let request = provider.createRequest()
        let controller = ASAuthorizationController(authorizationRequests: [request])
        
        controller.delegate = self
        controller.presentationContextProvider = self
        
        controller.performRequests()
    }
}

extension AppleLoginRequester: ASAuthorizationControllerDelegate {
    // 인증 성공
    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        guard let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential else { return }
        guard let identityTokenData = appleIDCredential.identityToken,
              let identityToken = String(data: identityTokenData, encoding: .utf8) else {
            delegate?.failed(message: "로그인 실패")
            return
        }
        
        #if DEBUG
        guard let authorizationCodeData = appleIDCredential.authorizationCode,
              let authorizationCode = String(data: authorizationCodeData, encoding: .utf8) else {
            delegate?.failed(message: "로그인 실패")
            return
        }

        Logger.debug("identityToken: \(identityToken)")
        Logger.debug("authorizationCode: \(authorizationCode)")
        #endif
        
        delegate?.success(token: identityToken)
    }
    
    // 인증 실패
    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        delegate?.failed(message: error.localizedDescription)
    }
}

extension AppleLoginRequester: ASAuthorizationControllerPresentationContextProviding {
    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        return window
    }
}
