//
//  AppInfoViewController.swift
//  
//
//  Created by 유정주 on 12/2/23.
//

import UIKit
import Domain

final class AppInfoViewController: BaseViewController<AppInfoView> {

    // MARK: - Properties
    weak var coordinator: AppInfoCoordinator?
    private let version: Version
    
    // MARK: - Init
    init(version: Version) {
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
        addTarget()
    }
    
    // MARK: - Actions
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
    private func addTarget() {
        layoutView.closeButton.addTarget(
            self,
            action: #selector(closeButtonDidClicked),
            for: .touchUpInside)
        layoutView.updateButton.addTarget(
            self,
            action: #selector(updateButtonDidClicked),
            for: .touchUpInside)
        layoutView.policyButton.addTarget(
            self,
            action: #selector(policyButtonDidClicked),
            for: .touchUpInside)
    }
    
    private func openURL(_ url: String) {
        guard let url = URL(string: url) else { return }
        UIApplication.shared.open(url)
    }
}
