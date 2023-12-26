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
        
    }
    
    typealias CategoryDataSource = ListDiffableDataSource<CategoryItem>
    
    // MARK: - Properties
    private var categoryDataSource: CategoryDataSource?
    var categories: [CategoryItem] = [] {
        didSet {
            categoryDataSource?.update(data: categories)
        }
    }
    
    init(
        categories: [CategoryItem]
    ) {
        self.categories = categories.filter { !$0.isWhole && !$0.isUnset }
    }
    
    func setupDataSource(_ dataSource: CategoryDataSource) {
        self.categoryDataSource = dataSource
        categoryDataSource?.update(data: categories)
    }
}
