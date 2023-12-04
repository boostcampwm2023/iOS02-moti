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
    
    private let fetchGroupListUseCase: FetchGroupListUseCase
    private var groupDataSource: GroupDataSource?
    private var groups: [Group] = [] {
        didSet {
            groupDataSource?.update(data: groups)
        }
    }
    
    @Published private(set) var groupListState: GroupListState = .initial
    
    init(fetchGroupListUseCase: FetchGroupListUseCase) {
        self.fetchGroupListUseCase = fetchGroupListUseCase
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
            do {
                groups = try await fetchGroupListUseCase.excute()
                groupListState = .finish
            } catch {
                Logger.error("\(#function) error: \(error.localizedDescription)")
                groupListState = .error(message: error.localizedDescription)
            }
        }
    }
}
