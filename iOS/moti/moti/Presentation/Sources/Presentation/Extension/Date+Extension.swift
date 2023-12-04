//
//  Date+Extension.swift
//
//
//  Created by 유정주 on 12/3/23.
//

import Foundation

extension Date {
    func convertStringYYYY년_MM월_dd일() -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy년 MM월 dd일"
        return dateFormatter.string(from: self)
    }
    
    func convertStringMM월_dd일() -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MM월 dd일"
        return dateFormatter.string(from: self)
    }
}
