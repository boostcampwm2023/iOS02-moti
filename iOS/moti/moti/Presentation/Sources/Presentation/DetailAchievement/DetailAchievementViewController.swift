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
    func deleteButtonDidClicked(achievementId: Int)
}

final class DetailAchievementViewController: BaseViewController<DetailAchievementView>, HiddenTabBarViewController {
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
    
    func update(updatedAchievement: Achievement) {
        viewModel.action(.update(updatedAchievement: updatedAchievement))
        layoutView.update(updatedAchievement: updatedAchievement)
    }
    
    private func setupUI() {
        let removeButton = UIBarButtonItem(title: "삭제", style: .plain, target: self, action: #selector(removeButtonDidClicked))
        removeButton.tintColor = .red
        let editButton = UIBarButtonItem(title: "편집", style: .plain, target: self, action: #selector(editButtonDidClicked))
        navigationItem.rightBarButtonItems = [removeButton, editButton]
    }
    
    @objc private func removeButtonDidClicked() {
        showDestructiveTwoButtonAlert(title: "정말로 삭제하시겠습니까?", message: "삭제된 도전 기록은 되돌릴 수 없습니다.") { [weak self] in
            guard let self else { return }
            viewModel.action(.delete)
        }
    }
    
    @objc private func editButtonDidClicked() {
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
                    Logger.error("fetch detail error: \(message)")
                }
            }
            .store(in: &cancellables)
        
        viewModel.$deleteState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .initial:
                    break
                case .success(let achievementId):
                    delegate?.deleteButtonDidClicked(achievementId: achievementId)
                case .failed(let message):
                    Logger.error("delete achievement error: \(message)")
                }
            }
            .store(in: &cancellables)
    }
}
