//
//  FetchGroupMemberListUseCase.swift
//
//
//  Created by Kihyun Lee on 12/5/23.
//

import Foundation

public struct FetchGroupMemberListUseCase {

    private let groupMemberRepository: GroupMemberRepositoryProtocol
    
    public init(groupMemberRepository: GroupMemberRepositoryProtocol) {
        self.groupMemberRepository = groupMemberRepository
    }
    
    public func execute() async throws -> [GroupMember] {
        return try await groupMemberRepository.fetchGroupMemberList()
    }
}
