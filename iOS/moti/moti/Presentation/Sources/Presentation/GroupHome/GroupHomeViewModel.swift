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
    // Group
    private(set) var group: Group
    
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
    private let skeletonAchievements: [Achievement] = (-20...(-1)).map { _ in Achievement.makeSkeleton() }

    // State
    @Published private(set) var categoryListState: CategoryListState = .initial
    @Published private(set) var achievementState: AchievementState = .initial

    // MARK: - Init
    init(group: Group) {
        self.group = group
    }
    
    // MARK: - Methods
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
    
    func findCategory(at index: Int) -> CategoryItem? {
        return categories[index]
    }
    
    func action(_ action: GroupHomeViewModelAction) {
        switch action {
        case .launch:
            fetchCategories()
        case .fetchAchievementList(let category):
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
                    Achievement(
                        id: 1,
                        category: .init(id: 1, name: "테스트", continued: 10, lastChallenged: .now),
                        title: "테스트 제목",
                        imageURL: URL(string: "https://serverless-thumbnail.kr.object.ncloudstorage.com/./049038f8-6984-46f6-8481-d2fafb507fe7.jpeg"),
                        body: "테스트 내용입니다.",
                        date: .now
                    )
                ]
                
                achievementState = .finish
            } catch {
                achievementState = .error(message: error.localizedDescription)
            }
        }
    }
}
