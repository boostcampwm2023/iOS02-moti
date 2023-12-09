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
            let appleId = 0
            let appstoreURLString = "itms-apps://itunes.apple.com/app/apple-store/\(appleId)"
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
        
    }
}
