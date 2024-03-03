//
//  DropGroupUseCase.swift
//  
//
//  Created by Kihyun Lee on 12/6/23.
//

import Foundation

public struct DropGroupUseCase {

    private let groupRepository: GroupRepositoryProtocol
    
    public init(groupRepository: GroupRepositoryProtocol) {
        self.groupRepository = groupRepository
    }
    
    public func execute(groupId: Int) async throws -> Bool {
        return try await groupRepository.dropGroup(groupId: groupId)
    }
}
