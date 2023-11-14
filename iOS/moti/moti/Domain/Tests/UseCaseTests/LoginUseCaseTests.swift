//
//  LoginUseCaseTests.swift
//  
//
//  Created by 유정주 on 11/14/23.
//

import XCTest
@testable import Domain

final class LoginUseCaseTests: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func test_로그인에_성공하면_user_생성() throws {
        let mockRepository = MockLoginRepository()
        let loginUseCase = LoginUseCase(repository: mockRepository)
        
        let expectation = XCTestExpectation(description: "test_로그인에_성공하면_user_생성")
        let source = User(code: "000000", avatarURL: "test")

        Task {
            let result = try await loginUseCase.excute()
            expectation.fulfill()
            
            XCTAssertEqual(result, source)
        }
        
        wait(for: [expectation], timeout: 3)
    }
    
    func test_로그인에_실패하면_user가_nil() throws {
        let mockRepository = MockLoginRepository()
        let loginUseCase = LoginUseCase(repository: mockRepository)
        
        let expectation = XCTestExpectation(description: "test_로그인에_실패하면_user가_nil")
        let source = User(code: "000000", avatarURL: "test")

        Task {
            let result = try? await loginUseCase.excute()
            expectation.fulfill()
            
            XCTAssertNil(result)
        }
        
        wait(for: [expectation], timeout: 3)
    }
}
