//
//  GroupListViewModel.swift
//
//
//  Created by 유정주 on 11/30/23.
//

import Foundation
import Domain
import Core

final class GroupListViewModel {
    enum GroupListViewModelAction {
        case launch
    }
    
    enum GroupListState {
        case initial
        case loading
        case finish
        case error(message: String)
    }

    typealias GroupDataSource = ListDiffableDataSource<Group>
    
    private var groupDataSource: GroupDataSource?

    private var groups: [Group] = [] {
        didSet {
            groupDataSource?.update(data: groups)
        }
    }
    
    @Published private(set) var groupListState: GroupListState = .initial
    
    init() {
        
    }
    
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
        }
    }
}

// MARK: - Action
extension GroupListViewModel {
    private func fetchGroupList() {
        groupListState = .loading
        
        Task {
            groups = [
                Group(id: 0, name: "test1", avatarUrl: nil, continued: 10, lastChallenged: .now),
                Group(id: 0, name: "test2", avatarUrl: nil, continued: 20, lastChallenged: .now),
                Group(id: 0, name: "test3", avatarUrl: nil, continued: 30, lastChallenged: .now)
            ]
            groupListState = .finish
        }
    }
}