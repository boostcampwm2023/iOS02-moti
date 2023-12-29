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

final class BlockUserViewModel {
    enum BlockUserViewModelAction {
        case fetchBlockedUserList
        case unblockUser
    }
    
    enum FetchBlockedUserListState {
        case success
        case failed(message: String)
    }
    
    typealias BlockUserDataSource = ListDiffableDataSource<BlockedUser>
    
    // MARK: - Properties
    private var blockUserDataSource: BlockUserDataSource?
    private var blockedUsers: [BlockedUser] = [] {
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
    
    func setupDataSource(_ dataSource: BlockUserDataSource) {
        self.blockUserDataSource = dataSource
        blockUserDataSource?.update(data: [])
    }
    
    func action(_ action: BlockUserViewModelAction) {
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
