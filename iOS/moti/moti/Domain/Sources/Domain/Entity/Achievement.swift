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
    public let user: User?
    public let userCode: String
    
    public init(
        id: Int,
        category: CategoryItem,
        title: String,
        imageURL: URL?,
        body: String?,
        date: Date,
        user: User? = nil
    ) {
        self.id = id
        self.category = category
        self._categoryId = category.id
        self.title = title
        self.imageURL = imageURL
        self.body = body
        self.date = date
        if let user = user {
            self.user = user
            self.userCode = user.code
        } else {
            let myUserId = UserDefaults.standard.readString(key: .myUserCode) ?? ""
            let myAvatarUrlString = UserDefaults.standard.readString(key: .myAvatarUrlString) ?? ""
            self.user = User(code: myUserId, avatarURL: URL(string: myAvatarUrlString), blockedDate: nil)
            self.userCode = myUserId
        }
    }
    
    public init(
        id: Int,
        title: String,
        imageURL: URL?,
        categoryId: Int,
        user: User? = nil
    ) {
        self.id = id
        self.category = nil
        self._categoryId = categoryId
        self.title = title
        self.imageURL = imageURL
        self.body = nil
        self.date = nil
        if let user = user {
            self.user = user
            self.userCode = user.code
        } else {
            let myUserId = UserDefaults.standard.readString(key: .myUserCode) ?? ""
            let myAvatarUrlString = UserDefaults.standard.readString(key: .myAvatarUrlString) ?? ""
            self.user = User(code: myUserId, avatarURL: URL(string: myAvatarUrlString), blockedDate: nil)
            self.userCode = myUserId
        }
    }
}

public extension Achievement {
    static func makeSkeleton(id: Int) -> Achievement {
        let id = id < 0 ? id : -id
        return .init(id: id, title: "", imageURL: nil, categoryId: 0, user: nil)
    }
}
