//
//  CategoryStorage.swift
//
//
//  Created by 유정주 on 11/29/23.
//

import Foundation
import Domain

public final class CategoryStorage {
    public let shared = CategoryStorage()
    private init() { }
    
    // MARK: - Properties
    private var storage: [Int: CategoryItem] = [:]
    
    // MARK: - Methods
    public func findName(id: Int) -> String? {
        return storage[id]?.name
    }
    
    public func create(categories: [CategoryItem]) {
        for category in categories {
            storage[category.id] = category
        }
    }
    
    public func create(category: CategoryItem) {
        storage[category.id] = category
    }
    
    public func update(category: CategoryItem) {
        storage[category.id] = category
    }
}
