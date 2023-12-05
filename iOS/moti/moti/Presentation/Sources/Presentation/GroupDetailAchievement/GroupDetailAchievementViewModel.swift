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
    
    /// Achievement가 자신의 기록인지 확인하는 메서드
    var isMyAchievement: Bool {
        return achievement.userCode == UserDefaults.standard.readString(key: .userCode)
    }
    
    init(achievement: Achievement, group: Group) {
        self.achievement = achievement
        self.group = group
    }
}
