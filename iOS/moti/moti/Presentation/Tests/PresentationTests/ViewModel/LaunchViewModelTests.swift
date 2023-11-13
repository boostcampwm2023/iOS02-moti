//
//  LaunchViewModelTests.swift
//
//
//  Created by 유정주 on 11/13/23.
//

import XCTest

final class LaunchViewModelTests: XCTestCase {

    private var launchVM: LaunchViewModel?
    
    override func setUpWithError() throws {
        let repository = Repository()
        let fetchVersionUseCase = FetchVersionUseCase(repository: repository)
        launchVM = LaunchViewModel(fetchVersionUseCase: fetchVersionUseCase)
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }
}
