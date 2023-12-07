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
    
    func convertStringyyyy_MM_dd() -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        return dateFormatter.string(from: self)
    }
    
    func relativeDateString(relativeTo: Date = Date()) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.locale = Locale(identifier: "ko_KR")
        formatter.dateTimeStyle = .numeric
        
        let relativeDateString = formatter.localizedString(for: self, relativeTo: relativeTo)
        
        return relativeDateString
    }
}
