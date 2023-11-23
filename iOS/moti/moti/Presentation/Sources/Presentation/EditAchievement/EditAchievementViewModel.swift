//
//  EditAchievementViewModel.swift
//
//
//  Created by 유정주 on 11/23/23.
//

import Foundation
import Domain

final class EditAchievementViewModel {
    
    enum Action {
        case fetchCategories
    }
    
    enum CategoryState {
        case none
        case loading
        case finish
    }
    
    private let fetchCategoryListUseCase: FetchCategoryListUseCase
    private(set) var categories: [CategoryItem] = []
    
    @Published private(set) var categoryState: CategoryState = .none
    
    init(
        fetchCategoryListUseCase: FetchCategoryListUseCase
    ) {
        self.fetchCategoryListUseCase = fetchCategoryListUseCase
    }

    func action(_ action: Action) {
        switch action {
        case .fetchCategories:
            fetchCategories()
        }
    }
    
    func findCategory(at index: Int) -> CategoryItem {
        return categories[index]
    }
    
    private func fetchCategories() {
        Task {
            do {
                categoryState = .loading
                categories = try await fetchCategoryListUseCase.execute()
                if !categories.isEmpty {
                    // 전체 카테고리 제거
                    categories.removeFirst()
                }
            } catch {
                categories = []
            }
            
            categoryState = .finish
        }
    }
}
