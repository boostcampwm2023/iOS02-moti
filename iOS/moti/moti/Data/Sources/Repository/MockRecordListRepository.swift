//
//  MockAchievementListRepository.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation
import Domain

public struct MockAchievementListRepository: AchievementListRepositoryProtocol {
    public init() { }
    public func fetchAchievementList() async throws -> [Achievement] {
        let json = """
        {
            "success": true,
            "message": "성공 메시지 예시",
            "data": [
                {
                    "id": "A4Yd01C",
                    "category": "다이어트",
                    "title": "잡채 다이어트 1일차",
                    "imageURL": "https://public.codesquad.kr/jk/storeapp/data/main/310_ZIP_P_0012_T.jpg",
                    "body": "다이어트는 너무 싫다. 그래도 잡채는 맛있다.",
                    "achieveCount": "1",
                    "date": "2023-10-29"
                },
                {
                    "id": "BBBBBBB",
                    "category": "다이어트",
                    "title": "잡채 다이어트 실패..",
                    "imageURL": "https://public.codesquad.kr/jk/storeapp/data/main/310_ZIP_P_0012_T.jpg",
                    "body": "잡채를 한바가지 먹어버렸다 ....",
                    "achieveCount": "0",
                    "date": "2023-11-01"
                },
                {
                    "id": "CCCCCCC",
                    "category": "다이어트",
                    "title": "잡채 다이어트 다시 시작",
                    "imageURL": "https://public.codesquad.kr/jk/storeapp/data/main/310_ZIP_P_0012_T.jpg",
                    "body": "다시 다이어트는 너무 싫다. 그래도 잡채는 맛있다.",
                    "achieveCount": "1",
                    "date": "2023-11-04"
                },
                {
                    "id": "DDDDDDD",
                    "category": "다이어트",
                    "title": "닭가슴살 다이어트 시작",
                    "imageURL": "https://oasisproduct.cdn.ntruss.com/76863/detail/detail_76863_0_b1616cc8-3a25-41a7-a145-613b50eb75b4.jpg",
                    "body": "다이어트는 너무 싫다. 그리고 닭가슴살은 맛없다.",
                    "achieveCount": "4",
                    "date": "2023-08-31"
                }
            ]
        }
        """
        
        guard let testData = json.data(using: .utf8) else { throw NetworkError.decode }
        let achievementListResponseDTO = try JSONDecoder().decode(AchievementListResponseDTO.self, from: testData)
        
        guard let achievementDTO = achievementListResponseDTO.data else { throw NetworkError.decode }
        return achievementDTO.map { Achievement(dto: $0) }
    }
}
