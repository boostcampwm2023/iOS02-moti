//
//  VersionRepositoryTests.swift
//  
//
//  Created by 유정주 on 11/13/23.
//

import XCTest
@testable import Data
@testable import Domain

final class VersionRepositoryTests: XCTestCase {

    private var repository = MockVersionRepository()
    
    override func setUpWithError() throws {
        repository = MockVersionRepository()
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func test_MockVersion을_Decoding하면_source와_같음() throws {
        let expectation = XCTestExpectation(description: "MockVersion을_Decoding하면_source와_같음")
        let source = Version(latest: "0.0.0", required: "0.0.0", privacyPolicy: "https://motimate.site/pivacy")
        
        Task {
            let result = try await repository.fetchVersion()
            expectation.fulfill()
        
            XCTAssertEqual(result, source)
        }
        
        wait(for: [expectation], timeout: 3)
    }

}
