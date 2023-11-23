//
//  Achievement.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public struct Achievement: Hashable {
    public let id: Int
    public let category: CategoryItem?
    public let title: String
    public let imageURL: URL?
    public let body: String?
    public let date: Date?
    
    public init(id: Int, category: CategoryItem?, title: String, imageURL: URL?, body: String?, date: Date?) {
        self.id = id
        self.category = category
        self.title = title
        self.imageURL = imageURL
        self.body = body
        self.date = date
    }
    
    public init(id: Int, title: String, imageURL: URL?) {
        self.id = id
        self.category = nil
        self.title = title
        self.imageURL = imageURL
        self.body = nil
        self.date = nil
    }
}
