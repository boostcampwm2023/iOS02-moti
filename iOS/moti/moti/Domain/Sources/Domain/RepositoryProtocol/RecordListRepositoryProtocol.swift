//
//  RecordListRepositoryProtocol.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import Foundation

public protocol RecordListRepositoryProtocol {
    func fetchRecordList() async throws -> [Record]
}
