//
//  CreateGroupUseCase.swift
//
//
//  Created by 유정주 on 12/4/23.
//

import Foundation

public struct CreateGroupRequestValue: RequestValue {
    private let name: String
    private let avatarUrl: URL?
    
    init(name: String, avatarUrl: URL? = nil) {
        self.name = name
        self.avatarUrl = avatarUrl
    }
}

public struct CreateGroupUseCase {
    private let groupRepository: GroupRepositoryProtocol
    
    public init(groupRepository: GroupRepositoryProtocol) {
        self.groupRepository = groupRepository
    }
    
    func execute(requestValue: CreateGroupRequestValue) async throws -> Group {
        return try await groupRepository.createGroup()
    }
}
