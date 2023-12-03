//
//  GroupDetailAchievementViewModel.swift
//
//
//  Created by 유정주 on 12/3/23.
//

import Foundation
import Domain

final class GroupDetailAchievementViewModel {
    private(set) var achievement: Achievement

    init(achievement: Achievement) {
        self.achievement = achievement
    }
}
