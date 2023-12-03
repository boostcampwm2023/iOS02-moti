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
    let group: Group

    init(achievement: Achievement, group: Group) {
        self.achievement = achievement
        self.group = group
    }
}
