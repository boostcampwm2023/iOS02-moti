//
//  LoginUseCaseTests.swift
//  
//
//  Created by 유정주 on 11/14/23.
//

import XCTest
@testable import Domain

final class LoginUseCaseTests: XCTestCase {

    private let sourceUser = User(code: "ABCDEFG", avatarURL: URL(string: "https://test.com"))
    private lazy var sourceUserToken = UserToken(
        accessToken: "testAccessToken",
        refreshToken: "testRefreshToken",
        user: sourceUser)
    private let testToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9"
    
    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    // TODO: Test Double Repository를 테스트 환경에서 생성하기
//    func test_로그인에_성공하면_UserToken_생성() throws {
//        let mockRepository = MockLoginRepository()
//        let loginUseCase = LoginUseCase(repository: mockRepository)
//        
//        let expectation = XCTestExpectation(description: "test_로그인에_성공하면_user_생성")
//
//        Task {
//            let result: UserToken = try await loginUseCase.excute(requestValue: .init(identityToken: testToken))
//            expectation.fulfill()
//            
//            XCTAssertEqual(result, sourceUserToken)
//        }
//        
//        wait(for: [expectation], timeout: 3)
//    }
//    
//    func test_로그인에_실패하면_user가_nil() throws {
//        let mockRepository = MockLoginRepository()
//        let loginUseCase = LoginUseCase(repository: mockRepository)
//        
//        let expectation = XCTestExpectation(description: "test_로그인에_실패하면_user가_nil")
//
//        Task {
//            let result = try? await loginUseCase.excute(requestValue: .init(identityToken: testToken))
//            expectation.fulfill()
//            
//            XCTAssertNil(result)
//        }
//        
//        wait(for: [expectation], timeout: 3)
//    }
//    
//    func test_자동로그인에_성공하면_UserToken_생성() {
//        let mockRepository = MockLoginRepository()
//        let autoLoginUseCase = AutoLoginUseCase(repository: mockRepository)
//        
//        let expectation = XCTestExpectation(description: "test_자동로그인에_성공하면_UserToken_생성")
//
//        Task {
//            let result: UserToken = try await autoLoginUseCase.excute(requestValue: .init(refreshToken: testToken))
//            expectation.fulfill()
//            
//            XCTAssertEqual(result, sourceUserToken)
//        }
//        
//        wait(for: [expectation], timeout: 3)
//    }
}
