//
//  GroupRepositoryProtocol.swift
//
//
//  Created by 유정주 on 12/4/23.
//

import Foundation

protocol GroupRepositoryProtocol {
    func fetchGroupList() async throws -> [Group]
}
