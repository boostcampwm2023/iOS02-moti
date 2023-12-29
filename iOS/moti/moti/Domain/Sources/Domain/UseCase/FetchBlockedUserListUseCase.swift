//
//  FetchBlockedUserListUseCase.swift
//
//
//  Created by Kihyun Lee on 12/29/23.
//

import Foundation

public struct FetchBlockedUserListUseCase {
    private let blockingRepository: BlockingRepositoryProtocol
    
    public init(blockingRepository: BlockingRepositoryProtocol) {
        self.blockingRepository = blockingRepository
    }
    
    public func execute() async throws -> [BlockedUser] {
        return try await blockingRepository.fetchBlockedUserList()
    }
}

