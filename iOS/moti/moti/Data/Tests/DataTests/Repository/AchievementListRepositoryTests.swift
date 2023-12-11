//
//  AchievementListRepositoryTests.swift
//  
//
//  Created by Kihyun Lee on 11/21/23.
//

import XCTest
@testable import Data
@testable import Domain

final class AchievementListRepositoryTests: XCTestCase {

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
    
    let emptyDataJson = """
    {
        "success" : true,
        "data" : {
            "count" : 0,
            "data" : []
        }
    }
    """
    
    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func test_queryParam_없이_AchievementList_요청시_nil을_return하는가() throws {
        let repository = MockAchievementListRepository(json: json)
        let expectation = XCTestExpectation(description: "test_queryParam_없이_AchievementList_요청시_nil을_return하는가")
        
        Task {
            let result = try await repository.fetchAchievementList()
        
            XCTAssertNotNil(result)
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 3)
    }
    
    func test_빈_AchievementList_응답을_디코딩하면_빈배열_return() throws {
        let emptyAchievementList: [Achievement] = []
        
        let repository = MockAchievementListRepository(json: emptyDataJson)
        let expectation = XCTestExpectation(description: "test_빈_AchievementList_응답을_디코딩하면_빈배열_return")
        
        Task {
            let result = try await repository.fetchAchievementList()
        
            let achievements = result.0
            let next = result.1
            
            XCTAssertEqual(achievements, emptyAchievementList)
            XCTAssertNil(next)
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 3)
    }

}
