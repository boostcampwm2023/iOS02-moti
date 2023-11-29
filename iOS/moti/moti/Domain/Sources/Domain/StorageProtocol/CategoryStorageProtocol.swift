//
//  CategoryStorageProtocol.swift
//
//
//  Created by 유정주 on 11/29/23.
//

import Foundation

public protocol CategoryStorageProtocol {
    var isEmpty: Bool { get }
    
    // Create
    func create(category: CategoryItem)
    func create(categories: [CategoryItem])
    
    // Read
    func find(categoryId: Int) -> CategoryItem?
    func fetchAll() -> [CategoryItem]
    
    // Update
    func update(category: CategoryItem)
    
    // Delete
    func delete(categoryId: Int)
    func deleteAll()
}
