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
        case fetchCategoryAchievementList(category: CategoryItem)
    }
    
    enum CategoryListState {
        case initial
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
