//
//  AuthButtonFactory.swift
//
//
//  Created by 유정주 on 11/12/23.
//

import Foundation
import AuthenticationServices
import Design

enum AuthButtonFactory {

    static func makeAppleLoginButton() -> ASAuthorizationAppleIDButton {
        let appleLoginButton = ASAuthorizationAppleIDButton(type: .default, style: .whiteOutline)
        return appleLoginButton
    }
}
