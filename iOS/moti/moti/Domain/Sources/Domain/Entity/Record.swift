//
//  Record.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public struct Record: Hashable {
    public let id: String
    public let category: String
    public let title: String
    public let imageURL: String
    public let body: String
    public let achieveCount: String
    public let date: String
    
    public init(id: String, category: String, title: String, imageURL: String, body: String, achieveCount: String, date: String) {
        self.id = id
        self.category = category
        self.title = title
        self.imageURL = imageURL
        self.body = body
        self.achieveCount = achieveCount
        self.date = date
    }
}
