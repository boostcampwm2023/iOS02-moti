//
//  HomeViewModel.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation
import Domain

final class HomeViewModel {
    private var dataSource: AchievementDiffableDataSource
    private let fetchAchievementListUseCase: FetchAchievementListUseCase
    
    var achievements: [Achievement] = []
    
    init(
        dataSource: AchievementDiffableDataSource = .init(),
        fetchAchievementListUseCase: FetchAchievementListUseCase
    ) {
        self.dataSource = dataSource
        self.fetchAchievementListUseCase = fetchAchievementListUseCase
    }
    
    func setupDataSource(_ dataSource: AchievementDiffableDataSource) {
        self.dataSource = dataSource
    }
    
    func updateDataSource(achievements: [Achievement]) {
        dataSource.update(with: achievements)
    }
    
    func fetchAchievementList() throws {
        Task {
            achievements = try await fetchAchievementListUseCase.execute()
            updateDataSource(achievements: achievements)
        }
    }
}
