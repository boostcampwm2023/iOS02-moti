//
//  NetworkLoginRepositoryTests.swift
//  
//
//  Created by 유정주 on 11/15/23.
//

import XCTest
@testable import Data
@testable import Domain

// XCConfig 값을 어떻게 가져올지 고민
final class NetworkLoginRepositoryTests: XCTestCase {

    private let loginRequestValue = LoginRequestValue(identityToken: "eyJraWQiOiJZdXlYb1kiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoia3IuY29kZXNxdWFkLmJvb3N0Y2FtcDgubW90aSIsImV4cCI6MTcwMDAzOTM5NywiaWF0IjoxNjk5OTUyOTk3LCJzdWIiOiIwMDEzMDYuYTAwZTI5ZGU4N2IyNDgwOGI5N2FiMjlhMDhlMjc3MjAuMTE0MiIsImNfaGFzaCI6ImpoZy05RGN5YzZ1WDZYU0RSNXByQUEiLCJhdXRoX3RpbWUiOjE2OTk5NTI5OTcsIm5vbmNlX3N1cHBvcnRlZCI6dHJ1ZX0.ppateLL5OGjQhm9SSWFPASKaTJrVQZrkDbqB_crWkapEuTJpZN7-M63STtNXOwzRPoAR5TA0U1M7idXU9-5UYO7-2B81rquSAA4t5lrtQJAF5ly1hUtlIIfl7_IDemm28r7c5-WqeqQ24hNDcPVM8zMC11s1aK6M_IGVeGq_jWmliW5GHPFr_RpCSV3kz6BcVqd7055n7aIx8eWb5gGGh3s14wtg7HeEpbg-iDEHqkAAOFyadB8b0CL66OeoBWogsZdS2JfQwD_jVDafn9uhh7jOae8d-XFyfePRwUAT5360LQlmVshA2nqlAJfNMDdhqG0VysrjpSOtA0reLiockg")
    private let autoLoginRequestValue = AutoLoginRequestValue(refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyQ29kZSI6Ilk0Q0Y1NDciLCJpYXQiOjE3MDAwNDUzOTMsImV4cCI6MTcwMDY1MDE5M30.H6t0xZyK0OlFurEv9XO25D6ggwdUscIBd5LY4gFXC3g")
    
    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    // TODO: xcconfig baseURL nil error
    func test_login을_요청하면_결과값이_존재함() throws {
        let repository = LoginRepository()
        let expectation = XCTestExpectation(description: "test_login을_요청하면_결과값이_존재함")
        
        Task {
            let result = try await repository.login(requestValue: loginRequestValue)
        
            XCTAssertNotNil(result)
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 3)
    }
    
    func test_유효한토큰으로_autologin을_요청하면_결과값이_존재함() throws {
        let repository = MockLoginRepository()
        let expectation = XCTestExpectation(description: "test_유효한토큰으로_autologin을_요청하면_결과값이_존재함")
        
        Task {
            let result = try await repository.autoLogin(requestValue: autoLoginRequestValue)
        
            XCTAssertNotNil(result)
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 3)
    }

}
