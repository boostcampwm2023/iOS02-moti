//
//  UpdateGradeUseCase.swift
//  
//
//  Created by Kihyun Lee on 12/6/23.
//

import Foundation

public struct UpdateGradeRequestValue: RequestValue {
    public let grade: String
    
    public init(grade: String) {
        self.grade = grade
    }
}

public struct UpdateGradeUseCase {
    private let repository: GroupMemberRepositoryProtocol
    
    public init(repository: GroupMemberRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(userCode: String, requestValue: UpdateGradeRequestValue) async throws -> Bool {
        return try await repository.updateGrade(userCode: userCode, requestValue: requestValue)
    }
}
