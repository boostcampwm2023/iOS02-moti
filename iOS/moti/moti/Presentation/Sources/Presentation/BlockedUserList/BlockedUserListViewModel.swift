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
        case unblockUser(indexPath: IndexPath)
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
        case .unblockUser(let indexPath):
            unblockUser(indexPath: indexPath)
        }
    }
    
    private func fetchBlockedUserList() {
        Task {
            do {
                fetchBlockedUserListState.send(.loading)
                let blockedUsers = try await fetchBlockedUserListUseCase.execute()
                self.blockedUsers = blockedUsers.sorted { $0.blockedDate ?? .now > $1.blockedDate ?? .now }
                fetchBlockedUserListState.send(.success)
            } catch {
                Logger.debug("blocked users fetch error: \(error)")
                fetchBlockedUserListState.send(.failed(message: error.localizedDescription))
            }
        }
    }
    
    private func unblockUser(indexPath: IndexPath) {
        let willUnblockedUser = blockedUsers[indexPath.row]
        Task {
            do {
                unblockUserState.send(.loading)
                let isSuccess = try await unblockUserUseCase.execute(userCode: willUnblockedUser.code)
                if isSuccess {
                    unblockUserState.send(.success)
                    deleteOfDataSource(user: willUnblockedUser)
                } else {
                    unblockUserState.send(.failed(message: "사용자 차단 해제에 실패했습니다."))
                }
            } catch {
                Logger.debug("unblock user error: \(error)")
                unblockUserState.send(.failed(message: error.localizedDescription))
            }
        }
    }
    
    func deleteOfDataSource(user: User) {
        blockedUsers = blockedUsers.filter { $0 != user }
    }
}
