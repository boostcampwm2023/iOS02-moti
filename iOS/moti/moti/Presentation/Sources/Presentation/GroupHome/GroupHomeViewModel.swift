//
//  GroupHomeViewModel.swift
//  
//
//  Created by 유정주 on 11/30/23.
//

import Foundation
import Domain
import Core

final class GroupHomeViewModel {
    typealias AchievementDataSource = ListDiffableDataSource<Achievement>
    typealias CategoryDataSource = ListDiffableDataSource<CategoryItem>
    
    // MARK: - Properties
    // Category
    private var categoryDataSource: CategoryDataSource?
    private var categories: [CategoryItem] = [] {
        didSet {
            categoryDataSource?.update(data: categories)
        }
    }
    private(set) var currentCategory: CategoryItem?
    
    // Achievement
    private var achievementDataSource: AchievementDataSource?
    private var achievements: [Achievement] = [] {
        didSet {
            achievementDataSource?.update(data: achievements)
        }
    }
    private let skeletonAchievements: [Achievement] = (-20...(-1)).map { Achievement(id: $0, title: "", imageURL: nil) }
    
    // State
    @Published private(set) var categoryListState: CategoryListState = .initial
    @Published private(set) var achievementState: AchievementState = .initial

    // MARK: - Init
    init() {
        
    }
    
    // MARK: - Methods
    func setupCategoryDataSource(_ dataSource: CategoryDataSource) {
        self.categoryDataSource = dataSource
    }
    
    func setupAchievementDataSource(_ dataSource: AchievementDataSource) {
        self.achievementDataSource = dataSource
        achievementDataSource?.update(data: [])
    }

    func action(_ action: GroupHomeViewModelAction) {
        switch action {
        case .launch:
            fetchCategories()
        case .fetchCategoryAchievementList(let category):
            fetchCategoryAchievementList(category: category)
        }
    }
}

// MARK: - Actions
private extension GroupHomeViewModel {
    /// 카테고리 리스트를 가져오는 액션
    func fetchCategories() {
        Task {
            do {
                categories = [
                    .init(id: 10, name: "그룹 카테고리1"),
                    .init(id: 11, name: "그룹 카테고리2"),
                    .init(id: 12, name: "그룹 카테고리3")
                ]
                categoryListState = .finish
            } catch {
                categoryListState = .error(message: error.localizedDescription)
            }
        }
    }
    
    func fetchCategoryAchievementList(category: CategoryItem) {
        guard currentCategory != category else {
            Logger.debug("현재 카테고리입니다.")
            return
        }
        
        currentCategory = category
        
        let requestValue = FetchAchievementListRequestValue(categoryId: category.id, take: nil, whereIdLessThan: nil)
        fetchAchievementList()
    }
}

// MARK: - Methods
private extension GroupHomeViewModel {
    /// 도전 기록을 가져오는 메서드
    func fetchAchievementList() {
        Task {
            do {
                achievementState = .loading
                
                achievements = [
                    .init(id: 10, title: "그룹 도전1", imageURL: nil),
                    .init(id: 11, title: "그룹 도전2", imageURL: nil),
                    .init(id: 12, title: "그룹 도전3", imageURL: nil),
                    .init(id: 13, title: "그룹 도전4", imageURL: nil),
                    .init(id: 14, title: "그룹 도전5", imageURL: nil),
                    .init(id: 15, title: "그룹 도전6", imageURL: nil),
                    .init(id: 16, title: "그룹 도전7", imageURL: nil),
                    .init(id: 17, title: "그룹 도전8", imageURL: nil),
                    .init(id: 18, title: "그룹 도전9", imageURL: nil),
                    .init(id: 19, title: "그룹 도전10", imageURL: nil)
                ]
                
                achievementState = .finish
            } catch {
                achievementState = .error(message: error.localizedDescription)
            }
        }
    }
}
