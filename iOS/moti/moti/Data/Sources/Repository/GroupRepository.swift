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
    
    public func fetchGroupMemberList(requestValue: FetchGroupMemberListRequestValue) async throws -> [GroupMember] {
        let endpoint = MotiAPI.fetchGroupMemberList(requestValue: requestValue)
        let responseDTO = try await provider.request(with: endpoint, type: FetchGroupMemberListResponseDTO.self)
        guard let groupMemberListDTO = responseDTO.data?.data else { throw NetworkError.decode }
        
        return groupMemberListDTO.map { GroupMember(dto: $0) }
    }

}
