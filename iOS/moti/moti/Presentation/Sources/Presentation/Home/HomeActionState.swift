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
        case fetchCategoryList(category: CategoryItem)
        case delete(achievementId: Int)
        case updateAchievement(id: Int, newCategoryId: Int)
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
    
    enum AchievementState {
        case initial
        case loading
        case finish
        case error(message: String)
    }
}
