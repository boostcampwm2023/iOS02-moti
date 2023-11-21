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

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    // TODO: xcconfig baseURL nil error
    func test_queryParam_없이_AchievementList_요청시_nil을_return하는가() throws {
        let repository = MockAchievementListRepository()
        let expectation = XCTestExpectation(description: "test_queryParam_없이_AchievementList_요청시_nil을_return하는가")
        
        Task {
            let result = try await repository.fetchAchievementList()
        
            XCTAssertNotNil(result)
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 3)
    }

}
