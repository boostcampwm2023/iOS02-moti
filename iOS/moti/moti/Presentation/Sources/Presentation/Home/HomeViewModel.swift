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
    private var currentCategoryId: Int = 0
    private var nextRequestValue: FetchAchievementListRequestValue?
    
    @Published private(set) var categoryState: CategoryState = .initial
    @Published private(set) var addCategoryState: AddCategoryState = .none
    @Published private(set) var achievementState: AchievementState = .initial
    
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
            fetchAchievementList()
        case .addCategory(let name):
            addCategory(name: name)
        case .fetchNextPage:
            fetchNextAchievementList()
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
    
    func selectedCategory(at index: Int) -> CategoryItem {
        currentCategoryId = categories[index].id
        return categories[index]
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
                addCategoryState = .finish
                categories.append(category)
            } else {
                addCategoryState = .error(message: "카테고리 추가에 실패했습니다.")
            }
        }
    }
    
    private func fetchAchievementList() {
        Task {
            do {
                achievementState = .loading
                (achievements, nextRequestValue) = try await fetchAchievementListUseCase.execute()
                achievementState = .finish
            } catch {
                achievementState = .error(message: error.localizedDescription)
            }
        }
    }
    
    private func fetchNextAchievementList() {
        guard let requestValue = nextRequestValue else {
            Logger.debug("마지막 페이지입니다.")
            return
        }
        
        Task {
            do {
                achievementState = .loading
                let requestValue = FetchAchievementListRequestValue(
                    categoryId: currentCategoryId,
                    take: requestValue.take,
                    whereIdLessThan: requestValue.whereIdLessThan
                )
                let (newAchievements, next) = try await fetchAchievementListUseCase.execute(requestValue: requestValue)
                achievements.append(contentsOf: newAchievements)
                nextRequestValue = next
                achievementState = .finish
            } catch {
                achievementState = .error(message: error.localizedDescription)
            }
        }
    }
}
