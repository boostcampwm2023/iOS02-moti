//
//  DetailAchievementViewModel.swift
//
//
//  Created by Kihyun Lee on 11/23/23.
//

import Foundation
import Domain
import Core
import Data

final class DetailAchievementViewModel {

    enum DetailAchievementViewModelAction {
        
        case launch
        case delete
        case update(updatedAchievement: Achievement)
    }
    
    enum LaunchState {

        case none
        case initial(title: String)
        case success(achievement: Achievement)
        case failed(message: String)
    }
    
    enum DeleteState {

        case initial
        case success(achievementId: Int)
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
        case .update(let updatedAchievement):
            self.achievement = updatedAchievement
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
                guard let categoryId = achievement.category?.id else { return }
                let isSuccess = try await deleteAchievementUseCase.execute(achievementId: achievement.id)
                
                if isSuccess {
                    deleteState = .success(achievementId: achievement.id)
                } else {
                    deleteState = .failed(message: "delete achievement error")
                }
            } catch {
                Logger.debug("delete achievement error: \(error)")
                deleteState = .failed(message: error.localizedDescription)
            }
        }
    }
}
