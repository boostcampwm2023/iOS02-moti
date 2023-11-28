//
//  HomeViewModel.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation
import Domain
import Core

final class HomeViewModel {
    enum HomeViewModelAction {
        case launch
        case addCategory(name: String)
        case fetchNextPage
        case fetchCategoryList(category: CategoryItem)
        case delete(achievementId: Int)
    }
    
    enum CategoryState {
        case initial
        case finish
        case error(message: String)
    }
    
    enum AddCategoryState {
        case none
        case loading
        case finish
        case error(message: String)
    }
    
    enum AchievementState {
        case initial
        case loading
        case finish
        case error(message: String)
    }
    
    typealias AchievementDataSource = ListDiffableDataSource<Achievement>
    typealias CategoryDataSource = ListDiffableDataSource<CategoryItem>
    
    private var categoryDataSource: CategoryDataSource?
    private let fetchCategoryListUseCase: FetchCategoryListUseCase
    private let addCategoryUseCase: AddCategoryUseCase

    private var achievementDataSource: AchievementDataSource?
    private let fetchAchievementListUseCase: FetchAchievementListUseCase
    
    private var categories: [CategoryItem] = [] {
        didSet {
            categoryDataSource?.update(data: categories)
        }
    }
    private var achievements: [Achievement] = [] {
        didSet {
            achievementDataSource?.update(data: achievements)
        }
    }
    private var lastRequestNextValue: FetchAchievementListRequestValue?
    private var nextRequestValue: FetchAchievementListRequestValue?
    private(set) var currentCategory: CategoryItem?
    private var nextAchievementTask: Task<Void, Never>?
    
    @Published private(set) var categoryState: CategoryState = .initial
    @Published private(set) var addCategoryState: AddCategoryState = .none
    @Published private(set) var achievementState: AchievementState = .initial
    
    // MARK: - Init
    init(
        fetchAchievementListUseCase: FetchAchievementListUseCase,
        fetchCategoryListUseCase: FetchCategoryListUseCase,
        addCategoryUseCase: AddCategoryUseCase
    ) {
        self.fetchAchievementListUseCase = fetchAchievementListUseCase
        self.fetchCategoryListUseCase = fetchCategoryListUseCase
        self.addCategoryUseCase = addCategoryUseCase
    }
    
    func action(_ action: HomeViewModelAction) {
        switch action {
        case .launch:
            fetchCategories()
        case .addCategory(let name):
            addCategory(name: name)
        case .fetchNextPage:
            fetchNextAchievementList()
        case .fetchCategoryList(let category):
            fetchCategoryAchievementList(category: category)
        case .delete(let achievementId):
            delete(achievementId: achievementId)
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
    
    private func findIndexOfAchievement(with achievementId: Int) -> Int? {
        return achievements.firstIndex { $0.id == achievementId }
    }
    
    private func delete(achievementId: Int) {
        guard let foundIndex = findIndexOfAchievement(with: achievementId) else { return }
        achievements.remove(at: foundIndex)
    }
    
    private func fetchCategories() {
        Task {
            do {
                categories = try await fetchCategoryListUseCase.execute()
                categoryState = .finish
            } catch {
                categoryState = .error(message: error.localizedDescription)
            }
        }
    }
    
    private func addCategory(name: String) {
        Task {
            addCategoryState = .loading
            let requestValue = AddCategoryRequestValue(name: name)
            let category = try? await addCategoryUseCase.execute(requestValue: requestValue)
            if let category {
                categories.append(category)
                addCategoryState = .finish
            } else {
                addCategoryState = .error(message: "카테고리 추가에 실패했습니다.")
            }
        }
    }
    
    private func fetchAchievementList(requestValue: FetchAchievementListRequestValue? = nil) {
        if requestValue?.whereIdLessThan == nil {
            // 새로운 카테고리 데이터를 가져오기 때문에 빈 배열로 초기화
            achievements = []
            nextRequestValue = nil
            lastRequestNextValue = nil
        }
        
        nextAchievementTask?.cancel()
        nextAchievementTask = Task {
            do {
                achievementState = .loading
                let (newAchievements, next) = try await fetchAchievementListUseCase.execute(requestValue: requestValue)
                if let nextAchievementTask, nextAchievementTask.isCancelled {
                    achievementState = .finish
                    return
                }
                
                if requestValue?.whereIdLessThan == nil {
                    achievements = newAchievements
                } else {
                    achievements.append(contentsOf: newAchievements)
                }
                
                nextRequestValue = next
                achievementState = .finish
            } catch {
                achievementState = .error(message: error.localizedDescription)
            }
        }
    }
    
    private func fetchCategoryAchievementList(category: CategoryItem) {
        guard currentCategory != category else {
            Logger.debug("현재 카테고리입니다.")
            return
        }
        
        currentCategory = category
        
        let requestValue = FetchAchievementListRequestValue(categoryId: category.id, take: nil, whereIdLessThan: nil)
        fetchAchievementList(requestValue: requestValue)
    }
    
    private func fetchNextAchievementList() {
        guard let requestValue = nextRequestValue,
              lastRequestNextValue?.whereIdLessThan != nextRequestValue?.whereIdLessThan else {
            Logger.debug("마지막 페이지입니다.")
            return
        }
        lastRequestNextValue = requestValue
        fetchAchievementList(requestValue: requestValue)
    }
}
