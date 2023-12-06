//
//  BlockingUserUseCase.swift
//
//
//  Created by 유정주 on 12/5/23.
//

import Foundation
import Core

public struct BlockingUserUseCase {
    private let blockingRepository: BlockingRepositoryProtocol
    
    public init(blockingRepository: BlockingRepositoryProtocol) {
        self.blockingRepository = blockingRepository
    }
    
    public func execute(userCode: String) {
        Task {
            let isSuccess = try? await blockingRepository.blockingUser(userCode: userCode)
            Logger.debug("사용자(\(userCode)) 차단: \(isSuccess ?? false)")
        }
    }
}
