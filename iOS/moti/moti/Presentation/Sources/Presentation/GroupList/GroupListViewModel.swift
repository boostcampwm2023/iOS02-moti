//
//  GroupListViewModel.swift
//
//
//  Created by 유정주 on 11/30/23.
//

import Foundation
import Domain
import Core
import Combine

final class GroupListViewModel {
    enum GroupListViewModelAction {
        case launch
        case createGroup(groupName: String)
        case dropGroup(groupId: Int)
    }
    
    enum GroupListState {
        case loading
        case finish
        case error(message: String)
    }
    
    enum CreateGroupState {
        case loading
        case finish
        case error(message: String)
    }
    
    enum DropGroupState {
        case loading
        case finish
        case error(message: String)
    }

    typealias GroupDataSource = ListDiffableDataSource<Group>
    
    // MARK: - Properties
    private let fetchGroupListUseCase: FetchGroupListUseCase
    private let createGroupUseCase: CreateGroupUseCase
    private let dropGroupUseCase: DropGroupUseCase
    private var groupDataSource: GroupDataSource?
    private var groups: [Group] = [] {
        didSet {
            groupDataSource?.update(data: groups)
        }
    }
    
    private(set) var groupListState = PassthroughSubject<GroupListState, Never>()
    private(set) var createGroupState = PassthroughSubject<CreateGroupState, Never>()
    private(set) var dropGroupState = PassthroughSubject<DropGroupState, Never>()
    
    // MARK: - Init
    init(
        fetchGroupListUseCase: FetchGroupListUseCase,
        createGroupUseCase: CreateGroupUseCase,
        dropGroupUseCase: DropGroupUseCase
    ) {
        self.fetchGroupListUseCase = fetchGroupListUseCase
        self.createGroupUseCase = createGroupUseCase
        self.dropGroupUseCase = dropGroupUseCase
    }
    
    // MARK: - Setup
    func setupGroupDataSource(_ dataSource: GroupDataSource) {
        self.groupDataSource = dataSource
        groupDataSource?.update(data: [])
    }
    
    func findGroup(at index: Int) -> Group {
        return groups[index]
    }

    func action(_ action: GroupListViewModelAction) {
        switch action {
        case .launch:
            fetchGroupList()
        case .createGroup(let groupName):
            createGroup(name: groupName)
        case .dropGroup(let groupId):
            dropGroup(groupId: groupId)
        }
    }
}

// MARK: - Action
extension GroupListViewModel {
    private func fetchGroupList() {
        Task {
            groupListState.send(.loading)
            do {
                groups = try await fetchGroupListUseCase.execute()
                groupListState.send(.finish)
            } catch {
                Logger.error("\(#function) error: \(error.localizedDescription)")
                groupListState.send(.error(message: error.localizedDescription))
            }
        }
    }
    
    private func createGroup(name: String) {
        Task {
            createGroupState.send(.loading)
            do {
                let requestValue = CreateGroupRequestValue(name: name)
                let newGroup = try await createGroupUseCase.execute(requestValue: requestValue)
                groups.append(newGroup)
                createGroupState.send(.finish)
            } catch {
                Logger.error("\(#function) error: \(error.localizedDescription)")
                createGroupState.send(.error(message: error.localizedDescription))
            }
        }
    }
    
    private func dropGroup(groupId: Int) {
        Task {
            dropGroupState.send(.loading)
            do {
                let requestValue = DropGroupRequestValue(groupId: groupId)
                let isSuccess = try await dropGroupUseCase.execute(requestValue: requestValue)
                if isSuccess {
                    deleteOfDataSource(groupId: groupId)
                    dropGroupState.send(.finish)
                } else {
                    dropGroupState.send(.error(message: "아이디가 \(groupId)인 그룹 탈퇴에 실패했습니다."))
                }
            } catch {
                Logger.error("\(#function) error: \(error.localizedDescription)")
                dropGroupState.send(.error(message: error.localizedDescription))
            }
        }
    }
    
    private func deleteOfDataSource(groupId: Int) {
        groups = groups.filter { $0.id != groupId }
    }
}
