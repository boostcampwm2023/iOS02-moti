//
//  DropGroupUseCase.swift
//  
//
//  Created by Kihyun Lee on 12/6/23.
//

import Foundation

public struct DropGroupRequestValue: RequestValue {
    public let groupId: Int
    
    public init(groupId: Int) {
        self.groupId = groupId
    }
}

public struct DropGroupUseCase {
    private let groupRepository: GroupRepositoryProtocol
    
    public init(groupRepository: GroupRepositoryProtocol) {
        self.groupRepository = groupRepository
    }
    
    public func execute(requestValue: DropGroupRequestValue) async throws -> Bool {
        return try await groupRepository.dropGroup(requestValue: requestValue)
    }
}
