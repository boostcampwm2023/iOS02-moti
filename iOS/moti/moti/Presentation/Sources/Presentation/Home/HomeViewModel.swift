//
//  HomeViewModel.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation
import Domain

final class HomeViewModel {
    enum HomeViewModelAction {
        case launch
    }
    
    enum CategoryState {
        case initial
        case finish
        case error(message: String)
    }
    
    enum AchievementState {
        case initial
        case finish
        case error(message: String)
    }
    
    typealias AchievementDataSource = ListDiffableDataSource<Achievement>
    typealias CategoryDataSource = ListDiffableDataSource<CategoryItem>
    
    private var categoryDataSource: CategoryDataSource?
    private let fetchCategoryListUseCase: FetchCategoryListUseCase

    private var achievementDataSource: AchievementDataSource?
    private let fetchAchievementListUseCase: FetchAchievementListUseCase
    
    private var categories: [CategoryItem] = []
    private var achievements: [Achievement] = []
    
    @Published private(set) var categoryState: CategoryState = .initial
    @Published private(set) var achievementState: AchievementState = .initial
    
    init(
        fetchAchievementListUseCase: FetchAchievementListUseCase,
        fetchCategoryListUseCase: FetchCategoryListUseCase
    ) {
        self.fetchAchievementListUseCase = fetchAchievementListUseCase
        self.fetchCategoryListUseCase = fetchCategoryListUseCase
    }
    
    func action(_ action: HomeViewModelAction) {
        switch action {
        case .launch:
            fetchCategories()
            fetchAchievementList()
        }
    }
    
    func setupCategoryDataSource(_ dataSource: CategoryDataSource) {
        self.categoryDataSource = dataSource
    }
    
    func setupAchievementDataSource(_ dataSource: AchievementDataSource) {
        self.achievementDataSource = dataSource
        achievementDataSource?.update(data: [])
    }
    
    func findAchievement(at index: Int) -> Achievement {
        return achievements[index]
    }
    
    func findCategory(at index: Int) -> CategoryItem {
        return categories[index]
    }
    
    private func fetchCategories() {
        Task {
            do {
                categories = try await fetchCategoryListUseCase.execute()
                categoryDataSource?.update(data: categories)
                categoryState = .finish
            } catch {
                categoryState = .error(message: error.localizedDescription)
            }
        }
    }
    
    private func fetchAchievementList() {
        Task {
            do {
                achievements = try await fetchAchievementListUseCase.execute()
                achievementDataSource?.update(data: achievements)
                achievementState = .finish
            } catch {
                achievementState = .error(message: error.localizedDescription)
            }
        }
    }
}
