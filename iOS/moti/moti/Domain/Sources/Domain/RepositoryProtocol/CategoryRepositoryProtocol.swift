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
}
