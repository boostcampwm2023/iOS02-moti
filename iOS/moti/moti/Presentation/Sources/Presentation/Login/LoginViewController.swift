//
//  LoginViewController.swift
//  
//
//  Created by 유정주 on 11/12/23.
//

import UIKit

final class LoginViewController: BaseViewController<LoginView> {

    // MARK: - Properties
    private var appleLoginRequester: AppleLoginRequester?
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        
        addTarget()
    }
    
    private func addTarget() {
        layoutView.appleLoginButton.addTarget(self, action: #selector(appleLoginButtonClicked), for: .touchUpInside)
    }
    
    // MARK: - Actions
    @objc private func appleLoginButtonClicked() {
        if appleLoginRequester == nil {
            appleLoginRequester = AppleLoginRequester(window: view.window!)
            appleLoginRequester?.delegate = self
        }
        appleLoginRequester?.request()
    }
}

extension LoginViewController: AppleLoginRequesterDelegate {
    func success(token: String) {
        print("token: \(token)")
    }
    
    func failed(error: Error) {
        print(error)
    }
}
