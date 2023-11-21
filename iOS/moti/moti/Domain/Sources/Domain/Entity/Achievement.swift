//
//  Achievement.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public struct Achievement: Hashable {
    public let id: Int
    public let category: String
    public let title: String
    public let imageURL: URL?
    public let body: String
    public let achieveCount: Int
    public let date: Date?
    
    public init(id: Int, category: String = "", title: String = "", imageURL: URL? = nil, body: String = "", achieveCount: Int = 0, date: Date? = nil) {
        self.id = id
        self.category = category
        self.title = title
        self.imageURL = imageURL
        self.body = body
        self.achieveCount = achieveCount
        self.date = date
    }
}
