//
//  LoginViewController.swift
//  
//
//  Created by 유정주 on 11/12/23.
//

import UIKit
import Core

final class LoginViewController: BaseViewController<LoginView> {

    // MARK: - Properties
    private var appleLoginRequester: AppleLoginRequester?
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        
        addTarget()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        // view.window가 필요하므로 viewDidAppear에서 setup
        // viewDidLayoutSubviews부터 window가 생기지만, 한 번만 호출하기 위해 viewDidAppear에서 호출
        setupAppleLoginRequester()
    }
    
    private func setupAppleLoginRequester() {
        guard appleLoginRequester == nil,
              let window = view.window else { return }
        
        appleLoginRequester = AppleLoginRequester(window: window)
        appleLoginRequester?.delegate = self
    }
    
    private func addTarget() {
        layoutView.appleLoginButton.addTarget(self, action: #selector(appleLoginButtonClicked), for: .touchUpInside)
    }
    
    // MARK: - Actions
    @objc private func appleLoginButtonClicked() {
        appleLoginRequester?.request()
    }
}

extension LoginViewController: AppleLoginRequesterDelegate {
    func success(token: String) {
        // TODO: ViewModel로 전달
        Logger.debug("token: \(token)")
    }
    
    func failed(error: Error) {
    }
}
