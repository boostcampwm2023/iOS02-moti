//
//  DetailAchievementViewController.swift
//
//
//  Created by Kihyun Lee on 11/22/23.
//

import UIKit
import Design
import Core
import Combine

final class DetailAchievementViewController: BaseViewController<DetailAchievementView> {
    weak var coordinator: DetailAchievementCoordinator?
    
    private let viewModel: DetailAchievementViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    init(viewModel: DetailAchievementViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        
        bind()
        viewModel.action(.launch)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        layoutView.cancelDownloadImage()
    }
    
    private func setupUI() {
        navigationItem.rightBarButtonItems = [
            UIBarButtonItem(title: "삭제", style: .plain, target: self, action: #selector(didClickedRemoveButton)),
            UIBarButtonItem(title: "편집", style: .plain, target: self, action: #selector(didClickedEditButton))
        ]
    }
    
    @objc private func didClickedRemoveButton() {
        Logger.debug("삭제 버튼!")
    }
    
    @objc private func didClickedEditButton() {
        Logger.debug("편집 버튼!")
    }
    
    private func bind() {
        viewModel.$launchState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none: break
                case .initial(let title):
                    layoutView.update(title: title)
                case .success(let achievement):
                    layoutView.configure(achievement: achievement)
                case .failed(let message):
                    Logger.error("fetch detail rrror: \(message)")
                }
            }
            .store(in: &cancellables)
    }
}
