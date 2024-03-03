//
//  JoinGroupUseCase.swift
//
//
//  Created by Kihyun Lee on 12/10/23.
//

import Foundation

public struct JoinGroupRequestValue: RequestValue {

    public let groupCode: String
    
    public init(groupCode: String) {
        self.groupCode = groupCode
    }
}

public struct JoinGroupUseCase {

    private let groupRepository: GroupRepositoryProtocol
    
    public init(groupRepository: GroupRepositoryProtocol) {
        self.groupRepository = groupRepository
    }
    
    public func execute(requestValue: JoinGroupRequestValue) async throws -> Bool {
        return try await groupRepository.joinGroup(requestValue: requestValue)
    }
}
