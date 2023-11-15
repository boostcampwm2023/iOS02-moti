//
//  HomeViewModel.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation
import Domain

final class HomeViewModel {
    typealias AchievementDataSource = ListDiffableDataSource<Achievement>
    
    private var achievementDataSource: AchievementDataSource?
    private let fetchAchievementListUseCase: FetchAchievementListUseCase
    
    private var achievements: [Achievement] = []
    
    init(
        achievementDataSource: AchievementDataSource? = nil,
        fetchAchievementListUseCase: FetchAchievementListUseCase
    ) {
        self.achievementDataSource = achievementDataSource
        self.fetchAchievementListUseCase = fetchAchievementListUseCase
    }
    
    func setupAchievementDataSource(_ dataSource: AchievementDataSource) {
        self.achievementDataSource = dataSource
    }
    
    func fetchAchievementList() throws {
        Task {
            achievements = try await fetchAchievementListUseCase.execute()
            achievementDataSource?.update(data: achievements)
        }
    }
}
