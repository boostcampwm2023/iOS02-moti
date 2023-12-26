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
        case fetchCategories
        case fetchCurrentCategoryInfo
        case fetchCategoryInfo(categoryId: Int)
        case addCategory(name: String)
        case fetchNextPage
        case fetchAchievementList(category: CategoryItem)
        case refreshAchievementList
        case deleteAchievementDataSourceItem(achievementId: Int)
        case deleteUserDataSourceItem(userCode: String)
        case updateAchievement(updatedAchievement: Achievement)
        case postAchievement(newAchievement: Achievement)
        case deleteAchievement(achievementId: Int, categoryId: Int)
        case fetchDetailAchievement(achievementId: Int)
        case logout
        case blockingAchievement(achievementId: Int)
        case blockingUser(userCode: String)
        case invite(userCode: String)
    }
    
    enum CategoryListState {
        case loading
        case finish
        case error(message: String)
    }
    
    enum CategoryInfoState {
        case loading
        case success(category: CategoryItem)
        case failed(message: String)
    }
    
    enum AddCategoryState {
        case loading
        case finish
        case error(message: String)
    }
    
    enum AchievementListState {
        case loading
        case isEmpty
        case finish
        case error(message: String)
    }
    
    enum FetchDetailAchievementState {
        case loading
        case finish(achievement: Achievement)
        case error(message: String)
    }
    
    enum DeleteAchievementState {
        case loading
        case success
        case failed
        case error(message: String)
    }
    
    enum InviteMemberState {
        case loading
        case success(userCode: String)
        case error(message: String)
    }
}
