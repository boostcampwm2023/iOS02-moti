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
    public init() { }
    public func fetchAchievementList(requestValue: FetchAchievementListRequestValue? = nil) async throws -> [Achievement] {
        let json = """
        {
            "success": true,
            "data": {
                "data": [
                    {
                        "id": 300,
                        "thumbnailUrl": "https://kr.object.ncloudstorage.com/motimate/study3_thumb.jpg",
                        "title": "tend"
                    },
                    {
                        "id": 299,
                        "thumbnailUrl": "https://kr.object.ncloudstorage.com/motimate/study2_thumb.jpg",
                        "title": "yard"
                    },
                    {
                        "id": 298,
                        "thumbnailUrl": "https://kr.object.ncloudstorage.com/motimate/study2_thumb.jpg",
                        "title": "improve"
                    },
                    {
                        "id": 297,
                        "thumbnailUrl": "https://kr.object.ncloudstorage.com/motimate/study1_thumb.jpg",
                        "title": "tonight"
                    },
                    {
                        "id": 296,
                        "thumbnailUrl": "https://kr.object.ncloudstorage.com/motimate/study3_thumb.jpg",
                        "title": "drug"
                    },
                    {
                        "id": 295,
                        "thumbnailUrl": "https://kr.object.ncloudstorage.com/motimate/study3_thumb.jpg",
                        "title": "plan"
                    },
                    {
                        "id": 294,
                        "thumbnailUrl": "https://kr.object.ncloudstorage.com/motimate/study3_thumb.jpg",
                        "title": "number"
                    },
                    {
                        "id": 293,
                        "thumbnailUrl": "https://kr.object.ncloudstorage.com/motimate/study2_thumb.jpg",
                        "title": "help"
                    },
                    {
                        "id": 292,
                        "thumbnailUrl": "https://kr.object.ncloudstorage.com/motimate/study1_thumb.jpg",
                        "title": "box"
                    },
                    {
                        "id": 291,
                        "thumbnailUrl": "https://kr.object.ncloudstorage.com/motimate/study1_thumb.jpg",
                        "title": "above"
                    },
                    {
                        "id": 290,
                        "thumbnailUrl": "https://kr.object.ncloudstorage.com/motimate/study2_thumb.jpg",
                        "title": "woman"
                    },
                    {
                        "id": 289,
                        "thumbnailUrl": "https://kr.object.ncloudstorage.com/motimate/study1_thumb.jpg",
                        "title": "accept"
                    }
                ],
                "count": 12,
                "next": {
                    "take": 12,
                    "whereIdLessThan": 289
                }
            }
        }
        """
        
        guard let testData = json.data(using: .utf8) else { throw NetworkError.decode }
        let achievementListResponseDTO = try JSONDecoder().decode(AchievementListResponseDTO.self, from: testData)
        
        guard let achievementListResponseDataDTO = achievementListResponseDTO.data else { throw NetworkError.decode }
        guard let achievementSimpleDTOs = achievementListResponseDataDTO.data else { throw NetworkError.decode }
        return achievementSimpleDTOs.map { Achievement(dto: $0) }
    }
}
