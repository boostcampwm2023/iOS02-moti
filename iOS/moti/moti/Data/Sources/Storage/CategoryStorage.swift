//
//  CategoryStorage.swift
//
//
//  Created by 유정주 on 11/29/23.
//

import Foundation
import Domain
import Core

public final class CategoryStorage: CategoryStorageProtocol {
    public static let shared = CategoryStorage()
    
    // MARK: - Properties
    private var storage: [Int: CategoryItem] = [:]
    
    public var isEmpty: Bool {
        return storage.isEmpty
    }
    
    private var wholeCategory: CategoryItem? {
        get { storage[0] }
        set { storage[0] = newValue }
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
    
    public func decrease(categoryId: Int) {
        Logger.debug("Decrease Continued \(categoryId)")
        storage[categoryId]?.continued -= 1
        wholeCategory?.continued -= 1
    }
    
    public func increase(categoryId: Int) {
        Logger.debug("Increase Continued \(categoryId)")
        storage[categoryId]?.continued += 1
        wholeCategory?.continued += 1
    }
    
    // Delete
    public func delete(categoryId: Int) {
        storage[categoryId] = nil
    }
    
    public func deleteAll() {
        storage = [:]
    }
}
