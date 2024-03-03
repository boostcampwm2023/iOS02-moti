//
//  AppInfoViewController.swift
//  
//
//  Created by 유정주 on 12/2/23.
//

import UIKit
import Combine
import Domain

final class AppInfoViewController: BaseViewController<AppInfoView>, LoadingIndicator {


    // MARK: - Properties
    let viewModel: AppInfoViewModel
    private var cancellables: Set<AnyCancellable> = []
    weak var coordinator: AppInfoCoordinator?
    private var appleLoginRequester: AppleLoginRequester?
    private let version: Version
    
    // MARK: - Init
    init(viewModel: AppInfoViewModel, version: Version) {
        self.viewModel = viewModel
        self.version = version
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        layoutView.configure(with: version)
        bind()
        addTarget()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        // view.window가 필요하므로 viewDidAppear에서 setup
        // viewDidLayoutSubviews부터 window가 생기지만, 한 번만 호출하기 위해 viewDidAppear에서 호출
        setupAppleLoginRequester()
    }

    private func bind() {
        viewModel.revokeState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                case .finish:
                    hideLoadingIndicator()
                case .error(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
    }
    
    // MARK: - Actions
    private func addTarget() {
        layoutView.closeButton.addTarget(self, action: #selector(closeButtonDidClicked), for: .touchUpInside)
        layoutView.updateButton.addTarget(self, action: #selector(updateButtonDidClicked), for: .touchUpInside)
        layoutView.policyButton.addTarget(self, action: #selector(policyButtonDidClicked), for: .touchUpInside)
        layoutView.revokeButton.addTarget(self, action: #selector(revokeButtonDidClicked), for: .touchUpInside)
    }
    
    @objc private func closeButtonDidClicked() {
        coordinator?.finish()
    }
    
    @objc private func updateButtonDidClicked() {
        if version.canUpdate {
            let appstoreURLString = "itms-apps://itunes.apple.com/app/apple-store/6471563249"
            openURL(appstoreURLString)
        } else {
            showOneButtonAlert(message: "이미 최신 버전입니다.")
        }
    }
    
    @objc private func policyButtonDidClicked() {
        openURL(version.privacyPolicy)
    }
    
    // MARK: - Methods
    private func openURL(_ url: String) {
        guard let url = URL(string: url) else { return }
        UIApplication.shared.open(url)
    }
    
    @objc private func revokeButtonDidClicked() {
        showTwoButtonAlert(
            title: "정말 회원 탈퇴를 하시겠습니까?",
            message: "회원 탈퇴 시 모든 기록이 삭제됩니다.",
            okAction: {
                self.appleLoginRequester?.request()
            }
        )
    }
    
    private func setupAppleLoginRequester() {
        guard appleLoginRequester == nil,
              let window = view.window else { return }
        
        appleLoginRequester = AppleLoginRequester(window: window)
        appleLoginRequester?.delegate = self
    }
}

extension AppInfoViewController: AppleLoginRequesterDelegate {

    func success(token: String, authorizationCode: String) {
        viewModel.action(.revoke(identityToken: token, authorizationCode: authorizationCode))
    }
    
    func failed(message: String) {
        showOneButtonAlert(title: "회원 탈퇴 실패", message: "다시 시도해 주세요.")
    }
}
