//
//  GroupHomeViewModel.swift
//  
//
//  Created by 유정주 on 11/30/23.
//

import Foundation
import Domain
import Core
import Combine

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
    private let fetchAchievementListUseCase: FetchAchievementListUseCase
    private var achievements: [Achievement] = [] {
        didSet {
            achievementDataSource?.update(data: achievements)
        }
    }
    private let skeletonAchievements: [Achievement] = (-20...(-1)).map { _ in Achievement.makeSkeleton() }

    // Pagenation
    private var lastRequestNextValue: FetchAchievementListRequestValue?
    private var nextRequestValue: FetchAchievementListRequestValue?
    private var nextAchievementTask: Task<Void, Never>?
    
    // State
    private(set) var categoryListState = PassthroughSubject<CategoryListState, Never>()
    private(set) var achievementListState = PassthroughSubject<AchievementListState, Never>()

    // MARK: - Init
    init(
        group: Group,
        fetchAchievementListUseCase: FetchAchievementListUseCase
    ) {
        self.group = group
        self.fetchAchievementListUseCase = fetchAchievementListUseCase
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
                categoryListState.send(.loading)
                categories = [
                    .init(id: 10, name: "그룹 카테고리1"),
                    .init(id: 11, name: "그룹 카테고리2"),
                    .init(id: 12, name: "그룹 카테고리3")
                ]
                categoryListState.send(.finish)
            } catch {
                categoryListState.send(.error(message: error.localizedDescription))
            }
        }
    }
    
    /// 다음 도전 기록 리스트를 가져오는 액션
    func fetchNextAchievementList() {
        guard let requestValue = nextRequestValue,
              lastRequestNextValue?.whereIdLessThan != nextRequestValue?.whereIdLessThan else {
            Logger.debug("마지막 페이지입니다.")
            return
        }
        lastRequestNextValue = requestValue
        fetchAchievementList(requestValue: requestValue)
    }
    
    /// 카테고리의 도전 기록 리스트를 가져오는 액션
    func fetchCategoryAchievementList(category: CategoryItem) {
        guard currentCategory != category else {
            Logger.debug("현재 카테고리입니다.")
            return
        }
        
        currentCategory = category
        
        let requestValue = FetchAchievementListRequestValue(categoryId: category.id, take: nil, whereIdLessThan: nil)
        fetchAchievementList(requestValue: requestValue)
    }
    
    /// 도전 기록 리스트를 새로고침 하는 액션
    func refreshAchievementList() {
        guard let currentCategory = currentCategory else { return }
        
        let requestValue = FetchAchievementListRequestValue(categoryId: currentCategory.id, take: nil, whereIdLessThan: nil)
        fetchAchievementList(requestValue: requestValue)
    }
}

// MARK: - Methods
private extension GroupHomeViewModel {
    /// 도전 기록을 가져오는 메서드
    func fetchAchievementList(requestValue: FetchAchievementListRequestValue? = nil) {
        if requestValue?.whereIdLessThan == nil {
            // 새로운 카테고리 데이터를 가져오기 때문에 빈 배열로 초기화
            achievements = skeletonAchievements
            nextRequestValue = nil
            lastRequestNextValue = nil
        }
        
        nextAchievementTask?.cancel()
        nextAchievementTask = Task {
            do {
                achievementListState.send(.loading)
                let (newAchievements, next) = try await fetchAchievementListUseCase.execute(requestValue: requestValue)
                let isFirstRequest = requestValue?.whereIdLessThan == nil
                if isFirstRequest {
                    achievements = newAchievements
                } else {
                    // 다음 페이지 요청이면 Append
                    achievements.append(contentsOf: newAchievements)
                }
                
                nextRequestValue = next
                achievementListState.send(.finish)
            } catch {
                if let nextAchievementTask, nextAchievementTask.isCancelled {
                    Logger.debug("NextAchievementTask is Cancelled")
                    achievementListState.send(.finish)
                } else {
                    achievementListState.send(.error(message: error.localizedDescription))
                }
            }
        }
    }
}
