//
//  GroupMemberViewModel.swift
//
//
//  Created by Kihyun Lee on 12/5/23.
//

import Foundation
import Domain
import Core
import Combine

final class GroupMemberViewModel {
    enum GroupMemberViewModelAction {
        case launch
        case updateGrade(groupMember: GroupMember, newGroupGrade: GroupGrade)
    }
    
    enum GroupMemberListState {
        case success
        case failed(message: String)
    }
    
    enum UpdateGradeState {
        case success
        case failed(message: String)
    }
    
    typealias GroupMemberDataSource = ListDiffableDataSource<GroupMember>
    
    // MARK: - Properties
    private var groupMemberDataSource: GroupMemberDataSource?
    private var groupMembers: [GroupMember] = [] {
        didSet {
            groupMemberDataSource?.update(data: groupMembers)
        }
    }
    
    private let fetchGroupMemberListUseCase: FetchGroupMemberListUseCase
    private let updateGradeUseCase: UpdateGradeUseCase
    
    private(set) var groupMemberListState = PassthroughSubject<GroupMemberListState, Never>()
    private(set) var updateGradeState = PassthroughSubject<UpdateGradeState, Never>()
    
    private let group: Group
    
    init(
        fetchGroupMemberListUseCase: FetchGroupMemberListUseCase,
        updateGradeUseCase: UpdateGradeUseCase,
        group: Group
    ) {
        self.fetchGroupMemberListUseCase = fetchGroupMemberListUseCase
        self.updateGradeUseCase = updateGradeUseCase
        self.group = group
    }
    
    func setupDataSource(_ dataSource: GroupMemberDataSource) {
        self.groupMemberDataSource = dataSource
        groupMemberDataSource?.update(data: [])
    }
    
    func action(_ action: GroupMemberViewModelAction) {
        switch action {
        case .launch:
            fetchGroupMemberList()
        case .updateGrade(let groupMember, let newGroupGrade):
            updateGrade(groupMember: groupMember, newGroupGrade: newGroupGrade)
        }
    }
    
    private func findIndex(groupMember: GroupMember) -> Int? {
        return groupMembers.firstIndex(of: groupMember)
    }
    
    private func fetchGroupMemberList() {
        Task {
            do {
                let groupMembers = try await fetchGroupMemberListUseCase.execute()
                self.groupMembers = groupMembers
                groupMemberListState.send(.success)
            } catch {
                Logger.debug("group members fetch error: \(error)")
                groupMemberListState.send(.failed(message: error.localizedDescription))
            }
        }
    }
    
    private func updateGrade(groupMember: GroupMember, newGroupGrade: GroupGrade) {
        guard let foundIndex = findIndex(groupMember: groupMember) else { return }
        Task {
            do {
                let isSuccess = try await updateGradeUseCase.execute(userCode: groupMember.user.code, requestValue: .init(grade: newGroupGrade.rawValue))
                if isSuccess {
                    groupMembers[foundIndex].grade = newGroupGrade
                    updateGradeState.send(.success)
                } else {
                    updateGradeState.send(.failed(message: "update grade fail"))
                }
            } catch {
                Logger.debug("update grade fail error: \(error)")
                updateGradeState.send(.failed(message: error.localizedDescription))
            }
        }
    }
}
