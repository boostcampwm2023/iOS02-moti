//
//  LoginViewController.swift
//  
//
//  Created by 유정주 on 11/12/23.
//

import UIKit
import Core
import Combine
import Domain

protocol LoginViewControllerDelegate: AnyObject {
    func didLogin()
}

final class LoginViewController: BaseViewController<LoginView> {

    // MARK: - Properties
    weak var delegate: LoginViewControllerDelegate?
    weak var coordinator: LoginCoordinator?
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
        viewModel.$loginState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none, .loading: break
                case .success:
                    delegate?.didLogin()
                    coordinator?.finish()
                case .failed:
                    showOneButtonAlert(title: "로그인 실패", message: "다시 시도해 주세요.")
                case .error(let message):
                    showErrorAlert(message: message)
                }
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
        viewModel.action(.login(identityToken: token))
    }
    
    func failed(error: Error) {
        showOneButtonAlert(title: "로그인 실패", message: "다시 시도해 주세요.")
    }
}
