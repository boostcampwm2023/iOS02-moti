//
//  CategoryRepositoryProtocol.swift
//
//
//  Created by 유정주 on 11/22/23.
//

import Foundation

public protocol CategoryRepositoryProtocol {

    func fetchCategory(categoryId: Int) async throws -> CategoryItem
    func fetchCategoryList() async throws -> [CategoryItem]
    func addCategory(requestValue: AddCategoryRequestValue) async throws -> CategoryItem
    func reorderCategories(requestValue: ReorderCategoriesRequestValue) async throws -> Bool
    func deleteCategory(categoryId: Int) async throws -> Bool
}
