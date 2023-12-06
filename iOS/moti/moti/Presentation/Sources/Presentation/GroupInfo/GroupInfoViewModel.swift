//
//  GroupInfoViewModel.swift
//  
//
//  Created by Kihyun Lee on 12/6/23.
//

import Foundation
import Domain
import Core
import Combine

final class GroupInfoViewModel {
    enum GroupInfoViewModelAction {
        case dropGroup(groupId: Int)
    }
    
    enum DropGroupState {
        case loading
        case finish
        case error(message: String)
    }
    
    // MARK: - Properties
    private let dropGroupUseCase: DropGroupUseCase
    
    private(set) var dropGroupState = PassthroughSubject<DropGroupState, Never>()
    
    // MARK: - Init
    init(
        dropGroupUseCase: DropGroupUseCase
    ) {
        self.dropGroupUseCase = dropGroupUseCase
    }
    
    func action(_ action: GroupInfoViewModelAction) {
        switch action {
        case .dropGroup(let groupId):
            dropGroup(groupId: groupId)
        }
    }
    
    private func dropGroup(groupId: Int) {
        Task {
            dropGroupState.send(.loading)
            do {
                let requestValue = DropGroupRequestValue(groupId: groupId)
                let isSuccess = try await dropGroupUseCase.execute(requestValue: requestValue)
                if isSuccess {
                    dropGroupState.send(.finish)
                } else {
                    dropGroupState.send(.error(message: "그룹 탈퇴에 실패했습니다."))
                }
            } catch {
                Logger.error("\(#function) error: \(error.localizedDescription)")
                dropGroupState.send(.error(message: error.localizedDescription))
            }
        }
    }
}
