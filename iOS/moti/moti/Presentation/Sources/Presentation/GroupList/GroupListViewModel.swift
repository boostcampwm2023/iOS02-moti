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
        case refetch
        case join(groupCode: String)
    }
    
    enum GroupListState {
        case none
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
    
    enum RefetchGroupListState {
        case loading
        case finishSame
        case finishDecreased
        case finishIncreased
        case error(message: String)
    }
    
    enum JoinGroupState {
        case loading
        case finish
        case error(message: String)
    }

    typealias GroupDataSource = ListDiffableDataSource<Group>
    
    // MARK: - Properties
    private let fetchGroupListUseCase: FetchGroupListUseCase
    private let createGroupUseCase: CreateGroupUseCase
    private let dropGroupUseCase: DropGroupUseCase
    private let joinGroupUseCase: JoinGroupUseCase
    private var groupDataSource: GroupDataSource?
    private var groups: [Group] = [] {
        didSet {
            groupDataSource?.update(data: groups)
        }
    }
    
    @Published private(set) var groupListState: GroupListState = .none
    private(set) var createGroupState = PassthroughSubject<CreateGroupState, Never>()
    private(set) var dropGroupState = PassthroughSubject<DropGroupState, Never>()
    private(set) var refetchGroupListState = PassthroughSubject<RefetchGroupListState, Never>()
    private(set) var joinGroupState = PassthroughSubject<JoinGroupState, Never>()
    
    // MARK: - Init
    init(
        fetchGroupListUseCase: FetchGroupListUseCase,
        createGroupUseCase: CreateGroupUseCase,
        dropGroupUseCase: DropGroupUseCase,
        joinGroupUseCase: JoinGroupUseCase
    ) {
        self.fetchGroupListUseCase = fetchGroupListUseCase
        self.createGroupUseCase = createGroupUseCase
        self.dropGroupUseCase = dropGroupUseCase
        self.joinGroupUseCase = joinGroupUseCase
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
        case .refetch:
            refetchGroupList()
        case .join(let groupCode):
            joinGroup(groupCode: groupCode)
        }
    }
}

// MARK: - Action
extension GroupListViewModel {
    private func fetchGroupList() {
        Task {
            groupListState = .loading
            do {
                let groups = try await fetchGroupListUseCase.execute()
                self.groups = groups.sorted { $0.lastChallenged ?? .distantPast > $1.lastChallenged ?? .distantPast }
                groupListState = .finish
            } catch {
                Logger.error("\(#function) error: \(error.localizedDescription)")
                groupListState = .error(message: error.localizedDescription)
            }
        }
    }
    
    private func refetchGroupList() {
        switch groupListState {
        case .finish:  // 이미 한 번 그룹 리스트를 읽어온 상태
            break
        default:
            return
        }
        
        Task {
            refetchGroupListState.send(.loading)
            do {
                let newGroups = try await fetchGroupListUseCase.execute()
                
                // TODO: 길이로 동작을 정의 - 탈퇴와 추방이 같아져 버린다
                if groups.count == newGroups.count {
                    refetchGroupListState.send(.finishSame)
                } else if groups.count < newGroups.count {
                    refetchGroupListState.send(.finishIncreased)
                } else {
                    refetchGroupListState.send(.finishDecreased)
                }
                
                groups = newGroups.sorted { $0.lastChallenged ?? .distantPast > $1.lastChallenged ?? .distantPast }
            } catch {
                Logger.error("\(#function) error: \(error.localizedDescription)")
                refetchGroupListState.send(.error(message: error.localizedDescription))
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
                let isSuccess = try await dropGroupUseCase.execute(groupId: groupId)
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
    
    private func joinGroup(groupCode: String) {
        Task {
            joinGroupState.send(.loading)
            do {
                let requestValue = JoinGroupRequestValue(groupCode: groupCode)
                let isSuccess = try await joinGroupUseCase.execute(requestValue: requestValue)
                if isSuccess {
                    joinGroupState.send(.finish)
                } else {
                    joinGroupState.send(.error(message: "\(groupCode) 그룹 참가에 실패했습니다."))
                }
            } catch {
                Logger.error("\(#function) error: \(error.localizedDescription)")
                joinGroupState.send(.error(message: error.localizedDescription))
            }
        }
    }
    
    private func deleteOfDataSource(groupId: Int) {
        groups = groups.filter { $0.id != groupId }
    }
}
