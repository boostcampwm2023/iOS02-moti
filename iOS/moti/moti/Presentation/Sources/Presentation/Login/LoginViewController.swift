//
//  LoginViewController.swift
//  
//
//  Created by 유정주 on 11/12/23.
//

import UIKit
import Core
import Combine

final class LoginViewController: BaseViewController<LoginView> {

    // MARK: - Properties
    private var appleLoginRequester: AppleLoginRequester?
    private let viewModel: LoginViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    // MARK: - Init
    init(viewModel: LoginViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        
        addTarget()
        
        bind()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        // view.window가 필요하므로 viewDidAppear에서 setup
        // viewDidLayoutSubviews부터 window가 생기지만, 한 번만 호출하기 위해 viewDidAppear에서 호출
        setupAppleLoginRequester()
    }
    
    private func bind() {
        viewModel.$userToken
            .dropFirst()
            .receive(on: RunLoop.main)
            .sink { [weak self] userToken in
                guard let self else { return }
                
                Logger.debug(userToken)
            }
            .store(in: &cancellables)
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
        Logger.debug("애플에서 전달된 token: \(token)")
        viewModel.requestLogin(identityToken: token)
    }
    
    func failed(error: Error) {
    }
}
