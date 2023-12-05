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
import Data

final class GroupHomeViewModel {
    typealias AchievementDataSource = ListDiffableDataSource<Achievement>
    typealias CategoryDataSource = ListDiffableDataSource<CategoryItem>
    
    // MARK: - Properties
    // Group
    private(set) var group: Group
    
    // Category
    private var categoryDataSource: CategoryDataSource?
    private let fetchCategoryListUseCase: FetchCategoryListUseCase
    private let addCategoryUseCase: AddCategoryUseCase
    private var categories: [CategoryItem] = [] {
        didSet {
            categoryDataSource?.update(data: categories)
        }
    }
    private(set) var currentCategory: CategoryItem?
    
    // Achievement
    private var achievementDataSource: AchievementDataSource?
    private let fetchAchievementListUseCase: FetchAchievementListUseCase
    private let deleteAchievementUseCase: DeleteAchievementUseCase
    private let fetchDetailAchievementUseCase: FetchDetailAchievementUseCase
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
    private(set) var addCategoryState = PassthroughSubject<AddCategoryState, Never>()
    private(set) var achievementListState = PassthroughSubject<AchievementListState, Never>()
    private(set) var deleteAchievementState = PassthroughSubject<DeleteAchievementState, Never>()
    private(set) var fetchDetailAchievementState = PassthroughSubject<FetchDetailAchievementState, Never>()

    // MARK: - Init
    init(
        group: Group,
        fetchAchievementListUseCase: FetchAchievementListUseCase,
        fetchCategoryListUseCase: FetchCategoryListUseCase,
        addCategoryUseCase: AddCategoryUseCase,
        deleteAchievementUseCase: DeleteAchievementUseCase,
        fetchDetailAchievementUseCase: FetchDetailAchievementUseCase
    ) {
        self.group = group
        self.fetchAchievementListUseCase = fetchAchievementListUseCase
        self.fetchCategoryListUseCase = fetchCategoryListUseCase
        self.addCategoryUseCase = addCategoryUseCase
        self.deleteAchievementUseCase = deleteAchievementUseCase
        self.fetchDetailAchievementUseCase = fetchDetailAchievementUseCase
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
    
    /// 파라미터로 받은 Achievement가 자신의 기록인지 확인하는 메서드
    func isMyAchievement(achievement: Achievement) -> Bool {
        return achievement.userCode == UserDefaults.standard.readString(key: .userCode)
    }
    
    func action(_ action: GroupHomeViewModelAction) {
        switch action {
        case .launch:
            fetchCategories()
        case .addCategory(let name):
            addCategory(name: name)
        case .fetchAchievementList(let category):
            fetchCategoryAchievementList(category: category)
        case .fetchNextPage:
            fetchNextAchievementList()
        case .refreshAchievementList:
            refreshAchievementList()
        case .deleteAchievement(let achievementId, let categoryId):
            deleteAchievement(achievementId: achievementId, categoryId: categoryId)
        case .fetchDetailAchievement(let achievementId):
            fetchDetailAchievement(id: achievementId)
        case .logout:
            NotificationCenter.default.post(name: .logout, object: nil)
            KeychainStorage.shared.remove(key: .accessToken)
            KeychainStorage.shared.remove(key: .refreshToken)
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
                categories = try await fetchCategoryListUseCase.execute()
                categoryListState.send(.finish)
            } catch {
                categoryListState.send(.error(message: error.localizedDescription))
            }
        }
    }
    
    func addCategory(name: String) {
        Task {
            addCategoryState.send(.loading)
            let requestValue = AddCategoryRequestValue(name: name)
            let category = try? await addCategoryUseCase.execute(requestValue: requestValue)
            if let category {
                categories.append(category)
                addCategoryState.send(.finish)
            } else {
                addCategoryState.send(.error(message: "카테고리 추가에 실패했습니다."))
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
    
    func deleteAchievement(achievementId: Int, categoryId: Int) {
        Task {
            do {
                deleteAchievementState.send(.loading)
                let requestValue = DeleteAchievementRequestValue(id: achievementId)
                let isSuccess = try await deleteAchievementUseCase.execute(
                    requestValue: requestValue,
                    categoryId: categoryId
                )
                
                if isSuccess {
                    deleteAchievementState.send(.success)
                    deleteOfDataSource(achievementId: achievementId)
                } else {
                    deleteAchievementState.send(.failed)
                }
            } catch {
                Logger.debug("delete achievement error: \(error)")
                deleteAchievementState.send(.error(message: error.localizedDescription))
            }
        }
    }
    
    func fetchDetailAchievement(id achievementId: Int) {
        Task {
            do {
                fetchDetailAchievementState.send(.loading)
                let achievement = try await fetchDetailAchievementUseCase.execute(
                    requestValue: FetchDetailAchievementRequestValue(id: achievementId))
                fetchDetailAchievementState.send(.finish(achievement: achievement))
            } catch {
                Logger.debug("detail achievement fetch error: \(error)")
                fetchDetailAchievementState.send(.error(message: error.localizedDescription))
            }
        }
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
                let achievementListItem = try await fetchAchievementListUseCase.execute(requestValue: requestValue)
                let isFirstRequest = requestValue?.whereIdLessThan == nil
                if isFirstRequest {
                    achievements = achievementListItem.achievements
                } else {
                    // 다음 페이지 요청이면 Append
                    achievements.append(contentsOf: achievementListItem.achievements)
                }
                
                nextRequestValue = achievementListItem.next
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
    
    /// Achievement의 첫 번째 index를 구하는 메서드
    func firstIndexOf(achievementId: Int) -> Int? {
        return achievements.firstIndex { $0.id == achievementId }
    }
    
    /// 도전 기록을 데이터소스에서 제거하는 액션
    func deleteOfDataSource(achievementId: Int) {
        guard let foundIndex = firstIndexOf(achievementId: achievementId) else { return }
        achievements.remove(at: foundIndex)
    }
}
