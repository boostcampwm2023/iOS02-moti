//
//  Record.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public struct Record: Hashable {
    public let id = UUID()
    public let category: String
    public let title: String
    public let imageURL: String
    public let body: String
    public let achieveCount: Int
    public let date: Date
}
