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
        case unblockUser(userCode: String)
    }
    
    enum FetchBlockedUserListState {
        case loading
        case success
        case failed(message: String)
    }
    
    enum UnblockUserState {
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
    private let unblockUserUseCase: UnblockUserUseCase
    
    private(set) var fetchBlockedUserListState = PassthroughSubject<FetchBlockedUserListState, Never>()
    private(set) var unblockUserState = PassthroughSubject<UnblockUserState, Never>()
    
    init(
        fetchBlockedUserListUseCase: FetchBlockedUserListUseCase,
        unblockUserUseCase: UnblockUserUseCase
    ) {
        self.fetchBlockedUserListUseCase = fetchBlockedUserListUseCase
        self.unblockUserUseCase = unblockUserUseCase
    }
    
    func setupDataSource(_ dataSource: BlockedUserListDataSource) {
        self.blockUserDataSource = dataSource
        blockUserDataSource?.update(data: [])
    }
    
    func action(_ action: BlockedUserListViewModelAction) {
        switch action {
        case .fetchBlockedUserList:
            fetchBlockedUserList()
        case .unblockUser(let userCode):
            unblockUser(userCode: userCode)
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
    
    private func unblockUser(userCode: String) {
        Task {
            do {
                unblockUserState.send(.loading)
                let isSuccess = try await unblockUserUseCase.execute(userCode: userCode)
                if isSuccess {
                    unblockUserState.send(.success)
                    deleteOfDataSource(userCode: userCode)
                } else {
                    unblockUserState.send(.failed(message: "사용자 차단 해제에 실패했습니다."))
                }
            } catch {
                Logger.debug("unblock user error: \(error)")
                unblockUserState.send(.failed(message: error.localizedDescription))
            }
        }
    }
    
    func deleteOfDataSource(userCode: String) {
        blockedUsers = blockedUsers.filter { $0.code != userCode }
    }
}
