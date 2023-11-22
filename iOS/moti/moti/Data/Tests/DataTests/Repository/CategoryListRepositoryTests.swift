//
//  CategoryListRepositoryTests.swift
//
//
//  Created by 유정주 on 11/22/23.
//

import XCTest
@testable import Domain

final class CategoryListRepositoryTests: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func test_형식에_맞는_json을_디코딩하면_카테고리_리스트_반환() throws {
        let repository = MockCategoryListRepository()
        let expectation = XCTestExpectation(description: "test_형식에_맞는_json을_디코딩하면_카테고리_리스트_반환")
        
        Task {
            let result = try await repository.fetchCategoryList()
            XCTAssertEqual(result.count, 2)
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 3)
    }
    
    func test_형식에_맞는_json을_디코딩하면_추가된_카테고리_반환() throws {
        let source = CategoryItem(id: 10, name: "테스트 카테고리")
        
        let repository = MockCategoryListRepository()
        let expectation = XCTestExpectation(description: "test_형식에_맞는_json을_디코딩하면_추가된_카테고리_반환")
        
        Task {
            let result = try await repository.addCategory(requestValue: .init(name: "테스트 카테고리"))
            XCTAssertEqual(result.id, source.id)
            XCTAssertEqual(result.name, source.name)
            
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 3)
    }
}
