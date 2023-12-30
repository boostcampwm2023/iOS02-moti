//
//  BlockUserViewModel.swift
//
//
//  Created by Kihyun Lee on 12/29/23.
//

import Foundation
import Domain
import Core
import Combine

final class BlockedUserListViewModel {
    enum BlockedUserListViewModelAction {
        case fetchBlockedUserList
        case unblockUser
    }
    
    enum FetchBlockedUserListState {
        case loading
        case success
        case failed(message: String)
    }
    
    typealias BlockedUserListDataSource = ListDiffableDataSource<User>
    
    // MARK: - Properties
    private var blockUserDataSource: BlockedUserListDataSource?
    private var blockedUsers: [User] = [] {
        didSet {
            blockUserDataSource?.update(data: blockedUsers)
        }
    }
    
    private let fetchBlockedUserListUseCase: FetchBlockedUserListUseCase
    
    private(set) var fetchBlockedUserListState = PassthroughSubject<FetchBlockedUserListState, Never>()
    
    init(
        fetchBlockedUserListUseCase: FetchBlockedUserListUseCase
    ) {
        self.fetchBlockedUserListUseCase = fetchBlockedUserListUseCase
    }
    
    func setupDataSource(_ dataSource: BlockedUserListDataSource) {
        self.blockUserDataSource = dataSource
        blockUserDataSource?.update(data: [])
    }
    
    func action(_ action: BlockedUserListViewModelAction) {
        switch action {
        case .fetchBlockedUserList:
            fetchBlockedUserList()
        case .unblockUser:
            break
        }
    }
    
    private func fetchBlockedUserList() {
        Task {
            do {
                fetchBlockedUserListState.send(.loading)
                let blockedUsers = try await fetchBlockedUserListUseCase.execute()
                self.blockedUsers = blockedUsers
                fetchBlockedUserListState.send(.success)
            } catch {
                Logger.debug("blocked users fetch error: \(error)")
                fetchBlockedUserListState.send(.failed(message: error.localizedDescription))
            }
        }
    }
}
