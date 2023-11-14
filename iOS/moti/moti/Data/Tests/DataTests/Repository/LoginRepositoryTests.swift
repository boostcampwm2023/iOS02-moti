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

    private let requestValue = LoginRequestValue(identityToken: "eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoia3IuY29kZXNxdWFkLmJvb3N0Y2FtcDgubW90aSIsImV4cCI6MTcwMDAyOTMzNiwiaWF0IjoxNjk5OTQyOTM2LCJzdWIiOiIwMDEzMDYuYTAwZTI5ZGU4N2IyNDgwOGI5N2FiMjlhMDhlMjc3MjAuMTE0MiIsImNfaGFzaCI6InlUOUcwSzRxeDk2R3hrQmxkUkpyZ3ciLCJhdXRoX3RpbWUiOjE2OTk5NDI5MzYsIm5vbmNlX3N1cHBvcnRlZCI6dHJ1ZX0.NFfi63CvYNcTUzc-s3OvrbRjTFDgEF4hJxfKdyjJmOqXUgdpZZhzkUl7-fDRvzpSFxZ8s2D0cxzUoq4hVMt9sWCavWnF7xK67dC9dgiQJ75p_YphVnY22oYUHU3gjBAeGhoziy-NcqeCwD1Sd_bgiwT9aijobYo2C1qVH5ueSgPXcE54Q0luougj960zmCn5WXz3WagO1f4VbnoLVNWZOTgLGZFOrUgHaKxwBtCeh01MC29oSgEcy7VevqfPE7nDI4JDEyN-qIhQGZDOwzvLibH7hIBsLIp0psRtIT_hGNtWfVZLH3ctuwLS4QF-affhI-H6LJUUX6lt_VrLmKpixw")
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
            let result = try await repository.login(requestValue: requestValue)
        
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
            let result = try? await repository.login(requestValue: requestValue)
            XCTAssertNil(result)
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 3)
    }
}
