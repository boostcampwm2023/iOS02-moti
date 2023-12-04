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
        
        guard let groupDTOs = responseDTO.data else { throw NetworkError.decode }
        
        return groupDTOs.map { Group(dto: $0) }
    }
}
