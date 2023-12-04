//
//  FetchGroupMemberListUseCase.swift
//
//
//  Created by Kihyun Lee on 12/5/23.
//

import Foundation

public struct FetchGroupMemberListRequestValue: RequestValue {
    public let groupId: Int
    
    public init(groupId: Int) {
        self.groupId = groupId
    }
}

public struct FetchGroupMemberListUseCase {
    private let groupRepository: GroupRepositoryProtocol
    
    public init(groupRepository: GroupRepositoryProtocol) {
        self.groupRepository = groupRepository
    }
    
    public func execute(requestValue: FetchGroupMemberListRequestValue) async throws -> [GroupMember] {
        return try await groupRepository.fetchGroupMemberList(requestValue: requestValue)
    }
}
