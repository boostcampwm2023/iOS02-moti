//
//  GroupMemberRepository.swift
//
//
//  Created by Kihyun Lee on 12/5/23.
//

import Foundation
import Domain

public struct GroupMemberRepository: GroupMemberRepositoryProtocol {
    private let provider: ProviderProtocol
    public let groupId: Int
    
    public init(provider: ProviderProtocol = Provider(), groupId: Int) {
        self.provider = provider
        self.groupId = groupId
    }
    
    public func fetchGroupMemberList() async throws -> [GroupMember] {
        let endpoint = MotiAPI.fetchGroupMemberList(groupId: groupId)
        let responseDTO = try await provider.request(with: endpoint, type: FetchGroupMemberListResponseDTO.self)
        guard let groupMemberListDTO = responseDTO.data?.data else { throw NetworkError.decode }
        
        return groupMemberListDTO.map { GroupMember(dto: $0) }
    }
}
