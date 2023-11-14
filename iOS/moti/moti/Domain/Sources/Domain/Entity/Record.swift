//
//  Record.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

struct Record: Hashable {
    let id = UUID()
    let category: String
    let title: String
    let imageURL: String
    let body: String
    let achieveCount: Int
    let date: Date
}
