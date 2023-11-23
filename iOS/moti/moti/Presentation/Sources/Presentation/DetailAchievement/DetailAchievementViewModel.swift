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
    }
    
    enum LaunchState {
        case initial
        case success
        case failed(message: String)
    }
    
    private let fetchDetailAchievementUseCase: FetchDetailAchievementUseCase
    
    @Published private(set) var launchState: LaunchState = .initial
    
    var achievement: Achievement
    
    init(
        fetchDetailAchievementUseCase: FetchDetailAchievementUseCase,
        achievement: Achievement
    ) {
        self.fetchDetailAchievementUseCase = fetchDetailAchievementUseCase
        self.achievement = achievement
    }
    
    func action(_ action: DetailAchievementViewModelAction) {
        switch action {
        case .launch:
            fetchDetailAchievement()
        }
    }
    
    private func fetchDetailAchievement() {
        Task {
            do {
                let achievement = try await fetchDetailAchievementUseCase.execute(
                    requestValue: FetchDetailAchievementRequestValue(id: achievement.id))
                self.achievement = achievement
                launchState = .success
            } catch {
                Logger.debug("detail achievement fetch error: \(error)")
                launchState = .failed(message: error.localizedDescription)
            }
        }
    }
}
