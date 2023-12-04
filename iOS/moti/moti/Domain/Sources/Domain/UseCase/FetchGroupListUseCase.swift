//
//  FetchGroupListUseCase.swift
//
//
//  Created by 유정주 on 12/4/23.
//

import Foundation

public struct FetchGroupListUseCase {
    private let groupRepository: GroupRepositoryProtocol
    
    init(groupRepository: GroupRepositoryProtocol) {
        self.groupRepository = groupRepository
    }
    
    func excute() async throws -> [Group] {
        return try await groupRepository.fetchGroupList()
    }
}