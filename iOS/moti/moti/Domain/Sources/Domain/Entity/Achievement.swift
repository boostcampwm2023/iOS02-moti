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
            _categoryId = category.id
        }
    }
    // CategoryItem 속성을 바꾸는 것보다 Id만 하나 추가하는 게 수정 범위가 더 적다고 판단하여 추가
    // 카테고리 id만 필요한 경우 해당 속성 사용
    public var categoryId: Int {
        return _categoryId
    }
    private var _categoryId: Int
    public var title: String
    public let imageURL: URL?
    public var body: String?
    public let date: Date?
    public let userCode: String
    
    public init(
        id: Int,
        category: CategoryItem,
        title: String,
        imageURL: URL?,
        body: String?,
        date: Date,
        userCode: String? = nil
    ) {
        self.id = id
        self.category = category
        self._categoryId = category.id
        self.title = title
        self.imageURL = imageURL
        self.body = body
        self.date = date
        if let userCode = userCode {
            self.userCode = userCode
        } else {
            self.userCode = UserDefaults.standard.readString(key: .userCode) ?? ""
        }
    }
    
    public init(
        id: Int,
        title: String,
        imageURL: URL?,
        categoryId: Int,
        userCode: String? = nil
    ) {
        self.id = id
        self.category = nil
        self._categoryId = categoryId
        self.title = title
        self.imageURL = imageURL
        self.body = nil
        self.date = nil
        if let userCode = userCode {
            self.userCode = userCode
        } else {
            self.userCode = UserDefaults.standard.readString(key: .userCode) ?? ""
        }
    }
}

public extension Achievement {
    static func makeSkeleton() -> Achievement {
        return .init(id: -(UUID().hashValue), title: "", imageURL: nil, categoryId: 0, userCode: "")
    }
}
