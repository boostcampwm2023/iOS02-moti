//
//  Achievement.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public struct Achievement: Hashable {
    public let id: Int
    public let category: String?
    public let title: String
    public let imageURL: URL?
    public let body: String?
    public let achieveCount: Int?
    public let date: Date?
    
    public init(
        id: Int,
        category: String,
        title: String,
        imageURL: URL?,
        body: String?,
        achieveCount: Int,
        date: Date
    ) {
        self.id = id
        self.category = category
        self.title = title
        self.imageURL = imageURL
        self.body = body
        self.achieveCount = achieveCount
        self.date = date
    }
    
    public init(id: Int, title: String, imageURL: URL?) {
        self.id = id
        self.category = nil
        self.title = title
        self.imageURL = imageURL
        self.body = nil
        self.achieveCount = nil
        self.date = nil
    }
}
