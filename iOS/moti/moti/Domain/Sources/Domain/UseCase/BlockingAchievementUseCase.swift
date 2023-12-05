//
//  BlockingAchievementUseCase.swift
//  
//
//  Created by 유정주 on 12/5/23.
//

import Foundation
import Core

public struct BlockingAchievementUseCase {
    private let blockingRepository: BlockingRepositoryProtocol
    
    public init(blockingRepository: BlockingRepositoryProtocol) {
        self.blockingRepository = blockingRepository
    }
    
    public func execute(achievementId: Int) {
        Task {
            let isSuccess = try? await blockingRepository.blockingAchievement(achievementId: achievementId)
            Logger.debug("도전기록(\(achievementId)) 차단: \(isSuccess ?? false)")
        }
    }
}
