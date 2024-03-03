//
//  GroupDetailAchievementActionState.swift
//
//
//  Created by 유정주 on 12/6/23.
//

import Foundation
import Domain

extension GroupDetailAchievementViewModel {

    enum GroupDetailAchievementViewModelAction {
        
        case launch
        case delete
        case update(updatedAchievement: Achievement)
        case blockingAchievement
        case blockingUser
        case fetchEmojis
        case toggleEmoji(emojiId: EmojiType)
    }
    
    enum LaunchState {

        case initial(title: String)
        case success(achievement: Achievement)
        case failed(message: String)
    }
    
    enum DeleteState {

        case loading
        case success(achievementId: Int)
        case failed(message: String)
    }
    
    enum FetchEmojisState {

        case success(emojis: [Emoji])
        case failed(message: String)
    }
}
