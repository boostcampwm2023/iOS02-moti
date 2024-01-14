//
//  ManageCategoryViewModel.swift
//
//
//  Created by Kihyun Lee on 12/25/23.
//

import Foundation
import Domain
import Core
import Combine

final class ManageCategoryViewModel {
    enum ManageCategoryViewModelAction {
        case reorderCategories
        case deleteCategory(index: Int)
    }
    
    enum ReorderCategoriesState {
        case success
        case failed(message: String)
    }
    
    enum DeleteCategoryState {
        case loading
        case success
        case failed(message: String)
    }
    
    typealias CategoryDataSource = ListDiffableDataSource<CategoryItem>
    
    // MARK: - Properties
    private var categoryDataSource: CategoryDataSource?
    var categories: [CategoryItem] = [] {
        didSet {
            categoryDataSource?.update(data: categories)
        }
    }
    
    private let reorderCategoriesUseCase: ReorderCategoriesUseCase
    private let deleteCategoryUseCase: DeleteCategoryUseCase
    
    private(set) var reorderCategoriesState = PassthroughSubject<ReorderCategoriesState, Never>()
    private(set) var deleteCategoryState = PassthroughSubject<DeleteCategoryState, Never>()
    
    init(
        categories: [CategoryItem],
        reorderCategoriesUseCase: ReorderCategoriesUseCase,
        deleteCategoryUseCase: DeleteCategoryUseCase
    ) {
        self.categories = categories.filter { !$0.isWhole && !$0.isUnset }
        self.reorderCategoriesUseCase = reorderCategoriesUseCase
        self.deleteCategoryUseCase = deleteCategoryUseCase
    }
    
    func setupDataSource(_ dataSource: CategoryDataSource) {
        self.categoryDataSource = dataSource
        categoryDataSource?.update(data: categories)
    }
    
    func swap(sourceIndex: Int, destinationIndex: Int) {
        // dataSource 이동
        categories.swapAt(sourceIndex, destinationIndex)
    }
    
    func action(_ action: ManageCategoryViewModelAction) {
        switch action {
        case .reorderCategories:
            reorderCategories()
        case .deleteCategory(let index):
            deleteCategory(categoryId: categories[index].id)
        }
    }
}

// MARK: - Actions
private extension ManageCategoryViewModel {
    func reorderCategories() {
        Task {
            do {
                let requestValue = ReorderCategoriesRequestValue(order: categories.map { $0.id })
                let isSuccess = try await reorderCategoriesUseCase.execute(requestValue: requestValue)
                if isSuccess {
                    reorderCategoriesState.send(.success)
                } else {
                    reorderCategoriesState.send(.failed(message: "카테고리 순서 변경을 실패했습니다."))
                }
            } catch {
                Logger.debug("reorder categories error: \(error)")
                reorderCategoriesState.send(.failed(message: error.localizedDescription))
            }
        }
    }
    
    func deleteCategory(categoryId: Int) {
        Task {
            do {
                deleteCategoryState.send(.loading)
                let isSuccess = try await deleteCategoryUseCase.execute(categoryId: categoryId)
                if isSuccess {
                    deleteCategoryState.send(.success)
                } else {
                    deleteCategoryState.send(.failed(message: "카테고리 삭제를 실패했습니다."))
                }
            } catch {
                Logger.debug("delete categories error: \(error)")
                deleteCategoryState.send(.failed(message: error.localizedDescription))
            }
        }
    }
}
