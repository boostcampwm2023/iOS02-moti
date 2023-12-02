//
//  Achievement.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public struct Achievement: Hashable {
    public let id: Int
    public var category: CategoryItem? {
        didSet {
            // categoryId 속성 동기화
            guard let category else { return }
            categoryId = category.id
        }
    }
    // CategoryItem 속성을 바꾸는 것보다 Id만 하나 추가하는 게 수정 범위가 더 적다고 판단하여 추가
    // 카테고리 id만 필요한 경우 해당 속성 사용
    public var categoryId: Int
    public var title: String
    public let imageURL: URL?
    public var body: String?
    public let date: Date?
    
    public init(
        id: Int,
        category: CategoryItem,
        title: String,
        imageURL: URL?,
        body: String?,
        date: Date
    ) {
        self.id = id
        self.category = category
        self.categoryId = category.id
        self.title = title
        self.imageURL = imageURL
        self.body = body
        self.date = date
    }
    
    public init(
        id: Int,
        title: String,
        imageURL: URL?,
        categoryId: Int
    ) {
        self.id = id
        self.category = nil
        self.categoryId = categoryId
        self.title = title
        self.imageURL = imageURL
        self.body = nil
        self.date = nil
    }
}
