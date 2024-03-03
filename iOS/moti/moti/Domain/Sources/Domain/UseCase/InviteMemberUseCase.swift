//
//  InviteMemberUseCase.swift
//
//
//  Created by 유정주 on 12/6/23.
//

import Foundation

public struct InviteMemberRequestValue: RequestValue {

    public let userCode: String
    
    public init(userCode: String) {
        self.userCode = userCode
    }
}

public struct InviteMemberUseCase {

    private let repository: GroupMemberRepositoryProtocol
    
    public init(repository: GroupMemberRepositoryProtocol) {
        self.repository = repository
    }
    
    public func execute(requestValue: InviteMemberRequestValue) async throws -> Bool {
        return try await repository.invite(requestValue: requestValue)
    }
}
