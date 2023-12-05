//
//  BlockingDTO.swift
//
//
//  Created by 유정주 on 12/6/23.
//

import Foundation

// data 응답이 필요 없어서 따로 파싱하지 않았습니다.
struct BlockingDTO: ResponseDTO {
    let success: Bool?
    let message: String?
}
