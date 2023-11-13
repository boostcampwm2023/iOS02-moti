//
//  FetchVersionUseCaseTests.swift
//  
//
//  Created by 유정주 on 11/13/23.
//

import XCTest

final class FetchVersionUseCaseTests: XCTestCase {

    private var fetchVersionUseCase: FetchVersionUseCase?
    
    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
        let repository = MockRepository()
        fetchVersionUseCase = FetchVersionUseCase(repository: repository)
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    func test_가져온_latest_버전이_000이면_true() throws {
        // ViewModel로 전달하는 값이 올바른지 테스트
        let version = await fetchVersionUseCase.execute()
        XCTAssertEqual(version.latest, "0.0.0")
    }
    
    func test_가져온_required_버전이_000이면_true() throws {
        let version = await fetchVersionUseCase.execute()
        XCTAssertEqual(version.required, "0.0.0")
    }
    
    func test_가져온_privacyPolicy가_testURL이면_true() throws {
        let version = await fetchVersionUseCase.execute()
        XCTAssertEqual(version.privacyPolicy, "https://motimate.site/pivacy")
    }
    
    func test_latest가_존재하는데_반환값이_nil이면_false() throws {
        let version = await fetchVersionUseCase.execute()
        XCTAssertFalse(version.latest == nil)
    }
    
    func test_required가_존재하는데_반환값이_nil이면_false() throws {
        let version = await fetchVersionUseCase.execute()
        XCTAssertFalse(version.required == nil)
    }
    
    func test_privacyPolicy가_존재하는데_반환값이_nil이면_false() throws {
        let version = await fetchVersionUseCase.execute()
        XCTAssertFalse(version.privacyPolicy == nil)
    }
}
