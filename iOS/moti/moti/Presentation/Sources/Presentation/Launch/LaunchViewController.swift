//
//  LaunchViewController.swift
//  moti
//
//  Created by 유정주 on 11/8/23.
//

import UIKit
import Combine
import Core

protocol LaunchViewControllerDelegate: AnyObject {

    func viewControllerDidLogin(isSuccess: Bool)
}

final class LaunchViewController: BaseViewController<LaunchView> {

    
    // MARK: - Properties
    weak var coordinator: LaunchCoodinator?
    weak var delegate: LaunchViewControllerDelegate?
    private let viewModel: LaunchViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    private var retryTimer: Timer?
    
    // MARK: - Init
    init(viewModel: LaunchViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        bind()
        
        viewModel.action(.fetchVersion)
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        retryTimer?.invalidate()
        retryTimer = nil
    }
    
    // MARK: - Methods
    private func startRetryVersionTimer() {
        retryTimer?.invalidate()
        retryTimer = Timer.scheduledTimer(withTimeInterval: 3, repeats: false) { [weak self] _ in
            guard let self else { return }
            viewModel.action(.fetchVersion)
        }
    }
    
    private func showRequiredUpdateAlert() {
        showOneButtonAlert(
            title: "안내",
            message: "앱 스토어에서 최신 앱으로 업데이트 하셔야만 실행이 가능합니다.",
            okTitle: "업데이트",
            okAction: {
                let appstoreURLString = "itms-apps://itunes.apple.com/app/apple-store/6471563249"
                guard let url = URL(string: appstoreURLString) else { return }
                UIApplication.shared.open(url)
            }
        )
    }
}

private extension LaunchViewController {

    func bind() {
        viewModel.$versionState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none: break
                case .loading:
                    layoutView.update(progressMessage: "버전을 가져오는 중")
                case .checkVersion:
                    layoutView.update(progressMessage: "버전을 검사하는 중")
                case .finish:
                    layoutView.update(progressMessage: "자동 로그인 시도 중")
                    viewModel.action(.autoLogin)
                case .requiredUpdate:
                    layoutView.update(progressMessage: "최신 앱으로 업데이트 필요")
                    showRequiredUpdateAlert()
                case .error(let message):
                    startRetryVersionTimer()
                    Logger.error("Launch Version Error: \(message)")
                }
            }
            .store(in: &cancellables)
        
        viewModel.$autoLoginState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none: break
                case .loading:
                    layoutView.update(progressMessage: "자동 로그인 시도 중")
                    Logger.debug("자동 로그인 진행 중")
                case .success:
                    layoutView.update(progressMessage: "자동 로그인 성공")
                    Logger.debug("자동 로그인 성공")
                    delegate?.viewControllerDidLogin(isSuccess: true)
                    coordinator?.finish(animated: false)
                case .failed(let message):
                    layoutView.update(progressMessage: "자동 로그인 실패")
                    Logger.debug("자동 로그인 실패: \(message)")
                    delegate?.viewControllerDidLogin(isSuccess: false)
                    coordinator?.finish(animated: false)
                }
            }
            .store(in: &cancellables)
    }
}
