//
//  UnblockUserUseCase.swift
//
//
//  Created by Kihyun Lee on 1/3/24.
//

import Foundation
import Core

public struct UnblockUserUseCase {
    private let blockingRepository: BlockingRepositoryProtocol
    
    public init(blockingRepository: BlockingRepositoryProtocol) {
        self.blockingRepository = blockingRepository
    }
    
    public func execute(userCode: String) async throws -> Bool {
        return try await blockingRepository.unblockUser(userCode: userCode)
    }
}
