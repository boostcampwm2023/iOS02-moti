//
//  ImageRepositoryProtocol.swift
//
//
//  Created by 유정주 on 11/27/23.
//

import Foundation

public protocol ImageRepositoryProtocol {

    func saveImage(requestValue: SaveImageRequestValue) async throws -> (Bool, Int)
}
