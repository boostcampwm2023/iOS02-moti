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
    typealias CategoryDataSource = ListDiffableDataSource<String>
    
    private var categoryDataSource: CategoryDataSource?
    
    private var achievementDataSource: AchievementDataSource?
    private let fetchAchievementListUseCase: FetchAchievementListUseCase
    
    private var categories: [String] = [
        "글자 크기가",
        "다른 문자열입니다.",
        "글자",
        "크기가 다른",
        "문자열"
    ]
    private var achievements: [Achievement] = []
    
    init(
        fetchAchievementListUseCase: FetchAchievementListUseCase
    ) {
        self.fetchAchievementListUseCase = fetchAchievementListUseCase
    }
    
    func setupCategoryDataSource(_ dataSource: CategoryDataSource) {
        self.categoryDataSource = dataSource
    }
    
    func setupAchievementDataSource(_ dataSource: AchievementDataSource) {
        self.achievementDataSource = dataSource
    }
    
    func fetchCategories() {
        categoryDataSource?.update(data: categories)
    }
    
    func fetchAchievementList() throws {
        Task {
            achievements = try await fetchAchievementListUseCase.execute()
            achievementDataSource?.update(data: achievements)
        }
    }
}
