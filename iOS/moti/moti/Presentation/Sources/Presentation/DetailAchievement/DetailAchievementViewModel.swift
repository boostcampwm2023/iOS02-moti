//
//  DetailAchievementViewModel.swift
//
//
//  Created by Kihyun Lee on 11/23/23.
//

import Foundation
import Domain
import Core

final class DetailAchievementViewModel {
    enum DetailAchievementViewModelAction {
        case launch
        case delete
    }
    
    enum LaunchState {
        case none
        case initial(title: String)
        case success(achievement: Achievement)
        case failed(message: String)
    }
    
    enum DeleteState {
        case initial
        case success(achievementId: Int?)
        case failed(message: String)
    }
    
    private let fetchDetailAchievementUseCase: FetchDetailAchievementUseCase
    private let deleteAchievementUseCase: DeleteAchievementUseCase
    
    @Published private(set) var launchState: LaunchState = .none
    @Published private(set) var deleteState: DeleteState = .initial
    
    private(set) var achievement: Achievement
    
    init(
        fetchDetailAchievementUseCase: FetchDetailAchievementUseCase,
        deleteAchievementUseCase: DeleteAchievementUseCase,
        achievement: Achievement
    ) {
        self.fetchDetailAchievementUseCase = fetchDetailAchievementUseCase
        self.deleteAchievementUseCase = deleteAchievementUseCase
        self.achievement = achievement
    }
    
    func action(_ action: DetailAchievementViewModelAction) {
        switch action {
        case .launch:
            initTitle()
            fetchDetailAchievement()
        case .delete:
            deleteAchievement()
        }
    }
    
    private func initTitle() {
        launchState = .initial(title: achievement.title)
    }
    
    private func fetchDetailAchievement() {
        Task {
            do {
                let achievement = try await fetchDetailAchievementUseCase.execute(
                    requestValue: FetchDetailAchievementRequestValue(id: achievement.id))
                self.achievement = achievement
                launchState = .success(achievement: achievement)
            } catch {
                Logger.debug("detail achievement fetch error: \(error)")
                launchState = .failed(message: error.localizedDescription)
            }
        }
    }
    
    private func deleteAchievement() {
        Task {
            do {
                let achievementId = try await deleteAchievementUseCase.execute(
                    requestValue: DeleteAchievementRequestValue(id: achievement.id))
                deleteState = .success(achievementId: achievementId)
            } catch {
                Logger.debug("delete achievement error: \(error)")
                deleteState = .failed(message: error.localizedDescription)
            }
        }
    }
}
