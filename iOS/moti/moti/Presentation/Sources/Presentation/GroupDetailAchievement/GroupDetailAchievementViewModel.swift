//
//  GroupDetailAchievementViewModel.swift
//
//
//  Created by 유정주 on 12/3/23.
//

import Foundation
import Combine
import Domain
import Core

final class GroupDetailAchievementViewModel {
    enum GroupDetailAchievementViewModelAction {
        case launch
        case delete
        case update(updatedAchievement: Achievement)
        case blockingAchievement
        case blockingUser
    }
    
    enum LaunchState {
        case initial(title: String)
        case success(achievement: Achievement)
        case failed(message: String)
    }
    
    enum DeleteState {
        case loading
        case success(achievementId: Int)
        case failed(message: String)
    }

    // MARK: - UseCase
    private let fetchDetailAchievementUseCase: FetchDetailAchievementUseCase
    private let deleteAchievementUseCase: DeleteAchievementUseCase
    // Blocking
    private let blockingUserUseCase: BlockingUserUseCase
    private let blockingAchievementUseCase: BlockingAchievementUseCase
    // Emoji
    private let fetchEmojisUseCase: FetchEmojisUseCase
    private let toggleEmojiUseCase: ToggleEmojiUseCase
    
    // MARK: - State
    private(set) var launchState = PassthroughSubject<LaunchState, Never>()
    private(set) var deleteState = PassthroughSubject<DeleteState, Never>()
    
    // MARK: - Properties
    private(set) var achievement: Achievement
    let group: Group
    
    /// Achievement가 자신의 기록인지 확인하는 메서드
    var isMyAchievement: Bool {
        return achievement.userCode == UserDefaults.standard.readString(key: .userCode)
    }
    
    init(
        fetchDetailAchievementUseCase: FetchDetailAchievementUseCase,
        deleteAchievementUseCase: DeleteAchievementUseCase,
        blockingUserUseCase: BlockingUserUseCase,
        blockingAchievementUseCase: BlockingAchievementUseCase,
        fetchEmojisUseCase: FetchEmojisUseCase,
        toggleEmojiUseCase: ToggleEmojiUseCase,
        achievement: Achievement,
        group: Group
    ) {
        self.fetchDetailAchievementUseCase = fetchDetailAchievementUseCase
        self.deleteAchievementUseCase = deleteAchievementUseCase
        self.blockingUserUseCase = blockingUserUseCase
        self.blockingAchievementUseCase = blockingAchievementUseCase
        self.fetchEmojisUseCase = fetchEmojisUseCase
        self.toggleEmojiUseCase = toggleEmojiUseCase
        self.achievement = achievement
        self.group = group
    }
    
    func action(_ action: GroupDetailAchievementViewModelAction) {
        switch action {
        case .launch:
            initTitle()
            fetchDetailAchievement()
        case .delete:
            deleteAchievement()
        case .update(let updatedAchievement):
            self.achievement = updatedAchievement
        case .blockingAchievement:
            blocking(achievementId: achievement.id)
        case .blockingUser:
            blocking(userCode: achievement.userCode)
        }
    }
}

// MARK: - Actions
extension GroupDetailAchievementViewModel {
    private func initTitle() {
        launchState.send(.initial(title: achievement.title))
    }
    
    private func fetchDetailAchievement() {
        Task {
            do {
                let achievement = try await fetchDetailAchievementUseCase.execute(
                    requestValue: FetchDetailAchievementRequestValue(id: achievement.id))
                self.achievement = achievement
                launchState.send(.success(achievement: achievement))
            } catch {
                Logger.debug("detail achievement fetch error: \(error)")
                launchState.send(.failed(message: error.localizedDescription))
            }
        }
    }
    
    private func deleteAchievement() {
        Task {
            do {
                deleteState.send(.loading)
                guard let categoryId = achievement.category?.id else { return }
                let isSuccess = try await deleteAchievementUseCase.execute(
                    requestValue: DeleteAchievementRequestValue(id: achievement.id),
                    categoryId: categoryId
                )
                
                if isSuccess {
                    deleteState.send(.success(achievementId: achievement.id))
                } else {
                    deleteState.send(.failed(message: "delete achievement error"))
                }
            } catch {
                Logger.debug("delete achievement error: \(error)")
                deleteState.send(.failed(message: error.localizedDescription))
            }
        }
    }
    
    /// 도전기록을 차단하는 액션
    func blocking(achievementId: Int) {
        blockingAchievementUseCase.execute(achievementId: achievementId)
    }
    
    /// 유저를 차단하는 액션
    func blocking(userCode: String) {
        blockingUserUseCase.execute(userCode: userCode)
    }
}
