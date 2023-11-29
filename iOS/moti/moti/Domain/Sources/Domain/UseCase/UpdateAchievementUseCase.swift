//
//  UpdateAchievementUseCase.swift
//
//
//  Created by Kihyun Lee on 11/29/23.
//

import Foundation

public struct UpdateAchievementRequestValue: RequestValue {
    public let title: String
    public let content: String
    public let categoryId: Int
    
    public init(title: String, content: String, categoryId: Int) {
        self.title = title
        self.content = content
        self.categoryId = categoryId
    }
}
