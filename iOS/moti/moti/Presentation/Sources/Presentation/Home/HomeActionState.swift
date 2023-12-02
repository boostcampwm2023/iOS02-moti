//
//  HomeActionState.swift
//  
//
//  Created by 유정주 on 11/30/23.
//

import Foundation
import Domain

extension HomeViewModel {
    enum HomeViewModelAction {
        case launch
        case addCategory(name: String)
        case fetchNextPage
        case fetchAchievementList(category: CategoryItem)
        case deleteAchievementDataSourceItem(achievementId: Int)
        case updateAchievement(updatedAchievement: Achievement)
        case postAchievement(newAchievement: Achievement)
        case deleteAchievement(achievementId: Int, categoryId: Int)
        case fetchDetailAchievement(achievementId: Int)
    }
    
    enum CategoryListState {
        case initial
        case finish
        case error(message: String)
    }
    
    enum CategoryState {
        case initial
        case updated(category: CategoryItem)
    }
    
    enum AddCategoryState {
        case none
        case loading
        case finish
        case error(message: String)
    }
    
    enum AchievementListState {
        case initial
        case loading
        case finish
        case error(message: String)
    }
    
    enum FetchDetailAchievementState {
        case none
        case loading
        case finish(achievement: Achievement)
        case error(message: String)
    }
    
    enum DeleteAchievementState {
        case none
        case loading
        case success
        case failed
        case error(message: String)
    }
}
