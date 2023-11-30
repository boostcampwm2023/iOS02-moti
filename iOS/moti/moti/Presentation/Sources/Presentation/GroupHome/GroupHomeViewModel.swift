//
//  GroupHomeViewModel.swift
//  
//
//  Created by 유정주 on 11/30/23.
//

import Foundation
import Domain

final class GroupHomeViewModel {
    typealias AchievementDataSource = ListDiffableDataSource<Achievement>
    typealias CategoryDataSource = ListDiffableDataSource<CategoryItem>
    
    // MARK: - Properties
    // Category
    private var categoryDataSource: CategoryDataSource?
    private var categories: [CategoryItem] = [] {
        didSet {
            categoryDataSource?.update(data: categories)
        }
    }
    private(set) var currentCategory: CategoryItem? {
        didSet {
            guard let currentCategory else { return }
            categoryState = .updated(category: currentCategory)
        }
    }
    
    // Achievement
    private var achievementDataSource: AchievementDataSource?
    private var achievements: [Achievement] = [] {
        didSet {
            achievementDataSource?.update(data: achievements)
        }
    }
    private let skeletonAchievements: [Achievement] = (-20...(-1)).map { Achievement(id: $0, title: "", imageURL: nil) }
    
    
    // State
    @Published private(set) var categoryListState: CategoryListState = .initial
    @Published private(set) var addCategoryState: AddCategoryState = .none
    @Published private(set) var achievementState: AchievementState = .initial
    @Published private(set) var categoryState: CategoryState = .initial

    // MARK: - Init
    init() {
        
    }
}
