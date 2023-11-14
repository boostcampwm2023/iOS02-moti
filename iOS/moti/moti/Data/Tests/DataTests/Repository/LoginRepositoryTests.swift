//
//  LoginRepositoryTests.swift
//  
//
//  Created by 유정주 on 11/14/23.
//

import XCTest
@testable import Data
@testable import Domain

final class LoginRepositoryTests: XCTestCase {

    private var repository = MockLoginRepository()
    private let requestValue = LoginRequestValue(identityToken: "testToken")
    private lazy var sourceUserToken = UserToken(accessToken: "testAccessToken", refreshToken: "testRefreshToken", user: sourceUser)
    private let sourceUser = User(code: "ABCDEFG", avatarURL: URL(string: "https://test.com"))

    override func setUpWithError() throws {
        repository = MockLoginRepository()
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func test_형식에_맞는_json을_디코딩하면_userToken_반환() throws {
        let expectation = XCTestExpectation(description: "test_형식에_맞는_json을_디코딩하면_userToken_반환")
        
        Task {
            let result = try await repository.login(requestValue: requestValue)
            expectation.fulfill()
        
            XCTAssertEqual(result, sourceUserToken)
            XCTAssertEqual(result.user, sourceUser)
        }
        
        wait(for: [expectation], timeout: 3)
    }
    
    func test_형식에_맞지_않는_json을_디코딩하면_decode_에러() throws {
        
    }
}
