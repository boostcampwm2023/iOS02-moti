//
//  GroupHomeActionState.swift
//
//
//  Created by 유정주 on 11/30/23.
//

import Foundation
import Domain

extension GroupHomeViewModel {
    enum GroupHomeViewModelAction {
        case launch
        case fetchNextPage
        case fetchAchievementList(category: CategoryItem)
        case refreshAchievementList
    }
    
    enum CategoryListState {
        case loading
        case finish
        case error(message: String)
    }
    
    enum AchievementListState {
        case loading
        case finish
        case error(message: String)
    }
}
