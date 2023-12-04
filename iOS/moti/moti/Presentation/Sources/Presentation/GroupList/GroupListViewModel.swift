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

    typealias GroupDataSource = ListDiffableDataSource<Group>
    
    // MARK: - Properties
    private let fetchGroupListUseCase: FetchGroupListUseCase
    private let createGroupUseCase: CreateGroupUseCase
    private var groupDataSource: GroupDataSource?
    private var groups: [Group] = [] {
        didSet {
            groupDataSource?.update(data: groups)
        }
    }
    
    private(set) var groupListState = PassthroughSubject<GroupListState, Never>()
    private(set) var createGroupState = PassthroughSubject<CreateGroupState, Never>()
    
    // MARK: - Init
    init(
        fetchGroupListUseCase: FetchGroupListUseCase,
        createGroupUseCase: CreateGroupUseCase
    ) {
        self.fetchGroupListUseCase = fetchGroupListUseCase
        self.createGroupUseCase = createGroupUseCase
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
}
