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
        return []
    }
}
