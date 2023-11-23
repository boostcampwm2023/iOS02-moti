//
//  MockAchievementListRepository.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation
@testable import Domain
@testable import Data

public struct MockAchievementListRepository: AchievementListRepositoryProtocol {
    private let json: String
    
    public init(json: String) {
        self.json = json
    }
    
    public func fetchAchievementList(
        requestValue: FetchAchievementListRequestValue? = nil
    ) async throws -> ([Achievement], FetchAchievementListRequestValue?) {
        guard let testData = json.data(using: .utf8) else { throw NetworkError.decode }
        
        let responseDTO = try JSONDecoder().decode(AchievementListResponseDTO.self, from: testData)
        guard let achievementListDataDTO = responseDTO.data else { throw NetworkError.decode }
        
        guard let achievementListDTO = achievementListDataDTO.data else { throw NetworkError.decode }
        let achievements = achievementListDTO.map { Achievement(dto: $0) }
        
        if let nextDTO = achievementListDataDTO.next {
            let next = FetchAchievementListRequestValue(
                categoryId: nextDTO.categoryId ?? -1,
                take: nextDTO.take ?? -1,
                whereIdLessThan: nextDTO.whereIdLessThan ?? -1
            )
            
            return (achievements, next)
        } else {
            return (achievements, nil)
        }
    }
}
