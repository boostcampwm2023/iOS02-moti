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
    }
    
    enum ReorderCategoriesState {
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
    
    private(set) var reorderCategoriesState = PassthroughSubject<ReorderCategoriesState, Never>()
    
    init(
        categories: [CategoryItem],
        reorderCategoriesUseCase: ReorderCategoriesUseCase
    ) {
        self.categories = categories.filter { !$0.isWhole && !$0.isUnset }
        self.reorderCategoriesUseCase = reorderCategoriesUseCase
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
        }
    }
    
    private func reorderCategories() {
        Task {
            do {
                let requestValue = ReorderCategoriesRequestValue(order: categories.map { $0.id })
                let isSuccess = try await reorderCategoriesUseCase.execute(requestValue: requestValue)
                if isSuccess {
                    reorderCategoriesState.send(.success)
                } else {
                    reorderCategoriesState.send(.failed(message: "카테고리 순서 변경에 실패했습니다."))
                }
            } catch {
                Logger.debug("reorder categories error: \(error)")
                
                // response가 비어있어서 204가 오는데, catch 문으로 넘어온다. 응답을 넣어주시면 없앤다.
                reorderCategoriesState.send(.success)
//                reorderCategoriesState.send(.failed(message: error.localizedDescription))
            }
        }
    }
}
