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
import Domain

protocol DetailAchievementViewControllerDelegate: AnyObject {
    func editButtonDidClicked(achievement: Achievement)
}

final class DetailAchievementViewController: BaseViewController<DetailAchievementView> {
    weak var coordinator: DetailAchievementCoordinator?
    weak var delegate: DetailAchievementViewControllerDelegate?
    
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
    
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        layoutView.cancelDownloadImage()
    }
    
    private func setupUI() {
        let removeButton = UIBarButtonItem(title: "삭제", style: .plain, target: self, action: #selector(didClickedRemoveButton))
        removeButton.tintColor = .red
        let editButton = UIBarButtonItem(title: "편집", style: .plain, target: self, action: #selector(didClickedEditButton))
        navigationItem.rightBarButtonItems = [removeButton, editButton]
    }
    
    @objc private func didClickedRemoveButton() {
        Logger.debug("삭제 버튼!")
    }
    
    @objc private func didClickedEditButton() {
        delegate?.editButtonDidClicked(achievement: viewModel.achievement)
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
