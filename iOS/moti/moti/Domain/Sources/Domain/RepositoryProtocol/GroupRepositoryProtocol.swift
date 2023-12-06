//
//  GroupRepositoryProtocol.swift
//
//
//  Created by 유정주 on 12/4/23.
//

import Foundation

public protocol GroupRepositoryProtocol {
    func fetchGroupList() async throws -> [Group]
    func createGroup(requestValue: CreateGroupRequestValue) async throws -> Group
    func dropGroup(groupId: Int) async throws -> Bool
}
