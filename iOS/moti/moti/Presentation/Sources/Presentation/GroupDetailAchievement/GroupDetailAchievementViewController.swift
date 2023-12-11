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
    func blockingAchievementMenuDidClicked(achievementId: Int)
    func blockingUserMenuDidClicked(userCode: String)
}

final class GroupDetailAchievementViewController: BaseViewController<GroupDetailAchievementView>, HiddenTabBarViewController, VibrationViewController {

    // MARK: - Properties
    weak var coordinator: GroupDetailAchievementCoordinator?
    weak var delegate: GroupDetailAchievementViewControllerDelegate?

    private let viewModel: GroupDetailAchievementViewModel
    private var cancellables: Set<AnyCancellable> = []
    private var timer: Timer?
    
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
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        // 화면에 보이면 이모지 polling
        startPollingTimer(timeInterval: 2, repeats: true)
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        layoutView.cancelDownloadImage()
        stopTimer()
    }
    
    // MARK: - Methods
    func update(updatedAchievement: Achievement) {
        viewModel.action(.update(updatedAchievement: updatedAchievement))
        layoutView.update(updatedAchievement: updatedAchievement)
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
    
    @objc private func emojiButtonDidToggled(_ sender: EmojiButton) {
        if let emojiType = EmojiType(emoji: sender.emoji) {
            viewModel.toggleEmoji(emojiType)
            startPollingTimer(timeInterval: 2, repeats: true)
        }
        sender.toggle()
        vibration(.selection)
    }
    
    private func startPollingTimer(timeInterval: CGFloat, repeats: Bool) {
        stopTimer()
        if timer == nil {
            DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 1) { [weak self] in
                guard let self else { return }
                viewModel.action(.fetchEmojis)
                timer = Timer.scheduledTimer(withTimeInterval: timeInterval, repeats: repeats) { [weak self] _ in
                    guard let self else { return }
                    viewModel.action(.fetchEmojis)
                }
            }
        }
    }
    
    private func stopTimer() {
        timer?.invalidate()
        timer = nil
    }
    
    // MARK: - Setup
    private func setupNavigationBar() {
        // 오른쪽 편집 버튼
        // 작성자 본인에게만 표시
        let editItem = UIBarButtonItem(
            title: "편집",
            style: .plain,
            target: self,
            action: #selector(editButtonDidClicked)
        )
        
        // 오른쪽 더보기 버튼
        let moreItem = UIBarButtonItem(
            image: SymbolImage.ellipsisCircle,
            style: .done,
            target: self,
            action: nil
        )
        
        let isMyAchievement = viewModel.isMyAchievement
        let grade = viewModel.group.grade
        
        // 작성자 본인, 관리자, 그룹장에게 표시
        let deleteAction = UIAction(title: "삭제", attributes: .destructive, handler: { _ in
            self.removeButtonDidClicked()
        })
        // 작성자가 아닌 유저에게만 표시
        let blockingAchievementAction = UIAction(title: "도전기록 차단", attributes: .destructive, handler: { _ in
            self.showDestructiveTwoButtonAlert(
                title: "도전기록 차단",
                message: "더이상 해당 도전기록을 볼 수 없습니다.\n정말 차단하시겠습니까?",
                okTitle: "차단",
                okAction: {
                    self.viewModel.action(.blockingAchievement)
                    self.delegate?.blockingAchievementMenuDidClicked(achievementId: self.viewModel.achievement.id)
            })
        })
        // 작성자가 아닌 유저에게만 표시
        let blockingUserAction = UIAction(title: "사용자 차단", attributes: .destructive, handler: { _ in
            self.showDestructiveTwoButtonAlert(
                title: "사용자 차단",
                message: "더이상 해당 사용자의 모든 도전기록을 볼 수 없습니다.\n정말 차단하시겠습니까?",
                okTitle: "차단",
                okAction: {
                    self.viewModel.action(.blockingUser)
                    self.delegate?.blockingUserMenuDidClicked(userCode: self.viewModel.achievement.userCode)
            })
        })
        // 신고
        let reportAction = UIAction(title: "신고", attributes: .destructive, handler: { _ in
            self.showOneButtonAlert(title: "신고 완료", message: "신고 처리되었습니다.")
        })
        
        var children: [UIAction] = []
        if isMyAchievement || grade == .leader || grade == .manager {
            children.append(contentsOf: [deleteAction])
        }
        
        // 그룹장, 관리자에게도 표시하기 위해 조건문 분리
        if !isMyAchievement {
            children.append(contentsOf: [blockingAchievementAction, blockingUserAction, reportAction])
        }
        moreItem.menu = UIMenu(children: children)
        
        if isMyAchievement {
            navigationItem.rightBarButtonItems = [moreItem, editItem]
        } else {
            navigationItem.rightBarButtonItems = [moreItem]
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
                    layoutView.setupDefaultEmojiButton(target: self, action: #selector(emojiButtonDidToggled))
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
        
        viewModel.fetchEmojisState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .success(let emojis):
                    layoutView.updateEmojis(emojis: emojis)
                case .failed(let message):
                    showErrorAlert(message: message)
                }
            }
            .store(in: &cancellables)
    }
}
