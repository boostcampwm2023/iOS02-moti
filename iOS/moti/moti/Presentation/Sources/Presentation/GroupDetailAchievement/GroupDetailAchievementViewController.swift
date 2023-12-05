//
//  GroupDetailAchievementViewController.swift
//  
//
//  Created by 유정주 on 12/3/23.
//

import UIKit
import Design
import Core
import Combine
import Domain

protocol GroupDetailAchievementViewControllerDelegate: DetailAchievementViewControllerDelegate {
    func blockingAchievementMenuDidClicked(achievement: Achievement)
    func blockingUserMenuDidClicked(user: User)
}

final class GroupDetailAchievementViewController: BaseViewController<GroupDetailAchievementView>, HiddenTabBarViewController {

    // MARK: - Properties
    weak var coordinator: GroupDetailAchievementCoordinator?
    weak var delegate: GroupDetailAchievementViewControllerDelegate?

    private let viewModel: GroupDetailAchievementViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    // MARK: - Init
    init(viewModel: GroupDetailAchievementViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNavigationBar()
        
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
    
    // MARK: - Setup
    func setupNavigationBar() {
        // 오른쪽 더보기 버튼
        let moreItem = UIBarButtonItem(
            image: SymbolImage.ellipsisCircle,
            style: .done,
            target: self,
            action: nil
        )
        
        let isMyAchievement = viewModel.isMyAchievement
        let grade = viewModel.group.grade
        
        // 작성자 본인에게만 표시
        let editAction = UIAction(title: "편집", handler: { _ in
            self.editButtonDidClicked()
        })
        // 작성자 본인, 관리자, 그룹장에게 표시
        let deleteAction = UIAction(title: "삭제", attributes: .destructive, handler: { _ in
            self.removeButtonDidClicked()
        })
        // 작성자가 아닌 유저에게만 표시
        let blockingAchievementAction = UIAction(title: "도전기록 차단", attributes: .destructive, handler: { _ in
            
        })
        // 작성자가 아닌 유저에게만 표시
        let blockingUserAction = UIAction(title: "사용자 차단", attributes: .destructive, handler: { _ in
            
        })
        
        var children: [UIAction] = []
        if isMyAchievement {
            children.append(contentsOf: [editAction, deleteAction])
        } else if grade == .leader || grade == .manager {
            children.append(contentsOf: [deleteAction])
        }
        
        // 그룹장, 관리자에게도 표시하기 위해 조건문 분리
        if !isMyAchievement {
            children.append(contentsOf: [blockingAchievementAction, blockingUserAction])
        }
        
        moreItem.menu = UIMenu(children: children)
        
        navigationItem.rightBarButtonItems = [moreItem]
    }

    @objc private func editButtonDidClicked() {
        delegate?.editButtonDidClicked(achievement: viewModel.achievement)
    }
    
    @objc private func removeButtonDidClicked() {
        showDestructiveTwoButtonAlert(title: "정말로 삭제하시겠습니까?", message: "삭제된 도전 기록은 되돌릴 수 없습니다.") { [weak self] in
            guard let self else { return }
            viewModel.action(.delete)
        }
    }
}

// MARK: - Binding
extension GroupDetailAchievementViewController: LoadingIndicator {
    private func bind() {
        viewModel.launchState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .initial(let title):
                    layoutView.update(title: title)
                case .success(let achievement):
                    layoutView.configure(achievement: achievement)
                case .failed(let message):
                    Logger.error("fetch detail error: \(message)")
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
        
        viewModel.deleteState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                case .success(let achievementId):
                    hideLoadingIndicator()
                    delegate?.deleteButtonDidClicked(achievementId: achievementId)
                case .failed(let message):
                    hideLoadingIndicator()
                    showErrorAlert(message: message)
                    Logger.error("delete achievement error: \(message)")
                }
            }
            .store(in: &cancellables)
    }
}
