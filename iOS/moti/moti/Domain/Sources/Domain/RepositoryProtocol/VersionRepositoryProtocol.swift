//
//  VersionRepositoryProtocol.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation

public protocol VersionRepositoryProtocol {
    func fetchVersion() async throws -> Version
}
