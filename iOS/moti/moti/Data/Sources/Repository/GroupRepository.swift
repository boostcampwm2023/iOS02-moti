//
//  GroupRepository.swift
//
//
//  Created by 유정주 on 12/4/23.
//

import Foundation
import Domain

public struct GroupRepository: GroupRepositoryProtocol {

    private let provider: ProviderProtocol
    
    public init(provider: ProviderProtocol = Provider()) {
        self.provider = provider
    }
    
    public func fetchGroupList() async throws -> [Group] {
        let endpoint = MotiAPI.fetchGroupList
        let responseDTO = try await provider.request(with: endpoint, type: FetchGroupListDTO.self)
        guard let groupDTOs = responseDTO.data?.data else { throw NetworkError.decode }
        
        return groupDTOs.map { Group(dto: $0) }
    }
    
    public func createGroup(requestValue: CreateGroupRequestValue) async throws -> Group {
        let endpoint = MotiAPI.createGroup(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: CreateGroupDTO.self)
        guard let groupDTO = responseDTO.data else { throw NetworkError.decode }
        
        // 생성한 사람은 항상 leader
        return Group(dto: groupDTO, grade: .leader)
    }
    
    public func dropGroup(groupId: Int) async throws -> Bool {
        let endpoint = MotiAPI.dropGroup(groupId: groupId)
        let responseDTO = try await provider.request(with: endpoint, type: DropGroupDTO.self)
        guard let dropGroupDataDTO = responseDTO.data else { throw NetworkError.decode }
        
        return responseDTO.success ?? false
    }
    
    public func joinGroup(requestValue: JoinGroupRequestValue) async throws -> Bool {
        let endpoint = MotiAPI.joinGroup(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: JoinGroupDTO.self)
        guard let joinGroupDataDTO = responseDTO.data else { throw NetworkError.decode }
        
        return responseDTO.success ?? false
    }
}
