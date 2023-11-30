//
//  CategoryStorage.swift
//
//
//  Created by 유정주 on 11/29/23.
//

import Foundation
import Domain

public final class CategoryStorage: CategoryStorageProtocol {
    public static let shared = CategoryStorage()
    
    // MARK: - Properties
    private var storage: [Int: CategoryItem] = [:]
    
    public var isEmpty: Bool {
        return storage.isEmpty
    }
    
    private init() { }
    
    // MARK: - Methods
    // Create
    public func create(categories: [CategoryItem]) {
        for category in categories {
            storage[category.id] = category
        }
    }
    
    public func create(category: CategoryItem) {
        storage[category.id] = category
    }
    
    // Read
    public func fetchAll() -> [CategoryItem] {
        // TODO: 지금은 id 순서대로 정렬. 나중에 카테고리 순서 바꿀 수 있을 때 다시 고민하기
        return Array(storage.values).sorted(by: { $0.id < $1.id })
    }
    
    public func find(categoryId: Int) -> CategoryItem? {
        return storage[categoryId]
    }
    
    // Update
    public func update(category: CategoryItem) {
        storage[category.id] = category
    }
    
    // Delete
    public func delete(categoryId: Int) {
        storage[categoryId] = nil
    }
    
    public func deleteAll() {
        storage = [:]
    }
    
    // Count Update
    public func decrease(categoryId: Int) {
        storage[categoryId]?.continued -= 1
        storage[0]?.continued -= 1
    }
}
