//
//  HomeViewModel.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation
import Domain
import Core
import Data

final class HomeViewModel {
    typealias AchievementDataSource = ListDiffableDataSource<Achievement>
    typealias CategoryDataSource = ListDiffableDataSource<CategoryItem>
    
    // MARK: - Properties
    // Category
    private var categoryDataSource: CategoryDataSource?
    private let fetchCategoryListUseCase: FetchCategoryListUseCase
    private let addCategoryUseCase: AddCategoryUseCase
    
    private var categories: [CategoryItem] = [] {
        didSet {
            categoryDataSource?.update(data: categories)
        }
    }
    private(set) var currentCategory: CategoryItem? {
        didSet {
            guard let currentCategory else { return }
            categoryState = .updated(category: currentCategory)
        }
    }
    
    // Achievement
    private var achievementDataSource: AchievementDataSource?
    private let fetchAchievementListUseCase: FetchAchievementListUseCase

    private let skeletonAchievements: [Achievement] = (-20...(-1)).map { Achievement(id: $0, title: "", imageURL: nil) }
    private var achievements: [Achievement] = [] {
        didSet {
            achievementDataSource?.update(data: achievements)
        }
    }
    
    // Pagenation
    private var lastRequestNextValue: FetchAchievementListRequestValue?
    private var nextRequestValue: FetchAchievementListRequestValue?
    private var nextAchievementTask: Task<Void, Never>?
    
    // State
    @Published private(set) var categoryListState: CategoryListState = .initial
    @Published private(set) var addCategoryState: AddCategoryState = .none
    @Published private(set) var achievementState: AchievementState = .initial
    @Published private(set) var categoryState: CategoryState = .initial
    
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
        let categoryId = categories[index].id
        return CategoryStorage.shared.find(categoryId: categoryId)
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
            deleteOfDataSource(achievementId: achievementId)
        case .updateAchievement(let id, let newCategoryId):
            updateAchievementCategory(achievementId: id, newCategoryId: newCategoryId)
        }
    }
}

// MARK: - Actions
private extension HomeViewModel {
    /// 카테고리 리스트를 가져오는 액션
    func fetchCategories() {
        Task {
            do {
                categories = try await fetchCategoryListUseCase.execute()
                categoryListState = .finish
            } catch {
                categoryListState = .error(message: error.localizedDescription)
            }
        }
    }
    
    /// 카테고리 리스트를 추가하는 액션
    func addCategory(name: String) {
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
    
    /// 도전 기록을 삭제하는 액션
    func deleteOfDataSource(achievementId: Int) {
        guard let foundIndex = firstIndexOf(achievementId: achievementId) else { return }
        achievements.remove(at: foundIndex)
        
        syncCurrentCategoryWithStorage()
    }
    
    /// 도전 기록의 카테고리를 변경하는 액션
    func updateAchievementCategory(achievementId: Int, newCategoryId: Int) {
        guard let currentCategory, currentCategory.id != 0 else { return }
        
        CategoryStorage.shared.decrease(categoryId: currentCategory.id)
        CategoryStorage.shared.increase(categoryId: newCategoryId)
        syncCurrentCategoryWithStorage()
        
        if currentCategory.id != newCategoryId {
            deleteOfDataSource(achievementId: achievementId)
        }
    }
}

// MARK: - Method
private extension HomeViewModel {
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
                achievementState = .loading
                let (newAchievements, next) = try await fetchAchievementListUseCase.execute(requestValue: requestValue)
                let isFirstRequest = requestValue?.whereIdLessThan == nil
                if isFirstRequest {
                    achievements = newAchievements
                } else {
                    // 다음 페이지 요청이면 Append
                    achievements.append(contentsOf: newAchievements)
                }
                
                nextRequestValue = next
                achievementState = .finish
            } catch {
                if let nextAchievementTask, nextAchievementTask.isCancelled {
                    Logger.debug("NextAchievementTask is Cancelled")
                    achievementState = .finish
                } else {
                    achievementState = .error(message: error.localizedDescription)
                }
            }
        }
    }
    
    /// Achievement의 첫 번째 index를 구하는 메서드
    func firstIndexOf(achievementId: Int) -> Int? {
        return achievements.firstIndex { $0.id == achievementId }
    }
    
    func syncCurrentCategoryWithStorage() {
        guard let currentCategoryId = currentCategory?.id,
              let storageData = CategoryStorage.shared.find(categoryId: currentCategoryId),
              currentCategory != storageData else { return }
        Logger.debug("Sync Current Category")
        // didSet은 같은 데이터를 넣어도 호출되므로 데이터가 다를 때만 대입
        currentCategory = storageData
    }
}
