//
//  GroupMemberRepositoryProtocol.swift
//  
//
//  Created by Kihyun Lee on 12/5/23.
//

import Foundation

public protocol GroupMemberRepositoryProtocol {
    func fetchGroupMemberList() async throws -> [GroupMember]
}
