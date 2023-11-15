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

    private let loginRequestValue = LoginRequestValue(identityToken: "test")
    private let autoLoginRequestValue = AutoLoginRequestValue(refreshToken: "test")
    private lazy var sourceUserToken = UserToken(accessToken: "testAccessToken", refreshToken: "testRefreshToken", user: sourceUser)
    private let sourceUser = User(code: "ABCDEFG", avatarURL: URL(string: "https://test.com"))

    override func setUpWithError() throws {

    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func test_형식에_맞는_json을_디코딩하면_userToken_반환() throws {
        let repository = MockLoginRepository()
        let expectation = XCTestExpectation(description: "test_형식에_맞는_json을_디코딩하면_userToken_반환")
        
        Task {
            let result = try await repository.login(requestValue: loginRequestValue)
        
            XCTAssertEqual(result, sourceUserToken)
            XCTAssertEqual(result.user, sourceUser)
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 3)
    }
    
    func test_형식에_맞지_않는_json을_디코딩하면_nil() throws {
        // data를 감싸는 닫는 중괄호가 없음
        let failedJSON = """
        {
            "success": true,
            "data": {
                "accessToken": "testAccessToken",
                "refreshToken": "testRefreshToken",
                "user": {
                    "userCode": "ABCDEFG",
                    "avatar_url": "https://test.com",
                }
            
        }
        """
        let repository = MockLoginRepository(json: failedJSON)
        let expectation = XCTestExpectation(description: "test_형식에_맞지_않는_json을_디코딩하면_nil")
        
        Task {
            // TODO: Error 체크 어떻게 하는지 확인
            let result = try? await repository.login(requestValue: loginRequestValue)
            XCTAssertNil(result)
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 3)
    }
    
    func test_형식에_맞는_autologin_json을_디코딩하면_userToken_반환() throws {
        let repository = MockLoginRepository()
        let expectation = XCTestExpectation(description: "test_형식에_맞는_json을_디코딩하면_userToken_반환")
        
        Task {
            let result = try await repository.autoLogin(requestValue: autoLoginRequestValue)
        
            XCTAssertEqual(result, sourceUserToken)
            XCTAssertEqual(result.user, sourceUser)
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 3)
    }
}
