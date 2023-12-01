//
//  AlertFactory.swift
//  
//
//  Created by Kihyun Lee on 11/20/23.
//

import UIKit

public enum AlertFactory {
    public static func makeOneButtonAlert(
        title: String? = "알림",
        message: String? = nil,
        okTitle: String? = "확인",
        okAction: (() -> Void)? = nil
    ) -> UIAlertController {
        let alertVC = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAlert = UIAlertAction(title: okTitle, style: .default) { _ in
            okAction?()
        }
        
        alertVC.addAction(okAlert)
        return alertVC
    }
    
    public static func makeTwoButtonAlert(
        title: String? = "알림",
        message: String? = nil,
        okTitle: String? = "확인",
        okAction: (() -> Void)? = nil,
        cancelTitle: String? = "취소",
        cancelAction: (() -> Void)? = nil
    ) -> UIAlertController {
        let alertVC = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAlert = UIAlertAction(title: okTitle, style: .default) { _ in
            okAction?()
        }
        let cancelAlert = UIAlertAction(title: cancelTitle, style: .cancel) { _ in
            cancelAction?()
        }
        
        alertVC.addAction(cancelAlert)
        alertVC.addAction(okAlert)
        return alertVC
    }
    
    public static func makeDestructiveTwoButtonAlert(
        title: String?,
        message: String?,
        okTitle: String?,
        okAction: (() -> Void)?
    ) -> UIAlertController {
        let alertVC = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAlert = UIAlertAction(title: okTitle, style: .destructive) { _ in
            okAction?()
        }
        let cancelAlert = UIAlertAction(title: "취소", style: .cancel)
        
        alertVC.addAction(cancelAlert)
        alertVC.addAction(okAlert)
        return alertVC
    }
    
    public static func makeTextFieldAlert(
        title: String?,
        okTitle: String?,
        placeholder: String?,
        okAction: ((String?) -> Void)?
    ) -> UIAlertController {
        let alertVC = UIAlertController(title: title, message: nil, preferredStyle: .alert)
        let okAlert = UIAlertAction(title: okTitle, style: .default) { _ in
            okAction?(alertVC.textFields?[0].text)
        }
        let cancelAlert = UIAlertAction(title: "취소", style: .cancel)
        
        alertVC.addAction(cancelAlert)
        alertVC.addAction(okAlert)
        // 오토레이아웃 warning이 발생하지만, 애플 에러이므로 무시해도 됨
        alertVC.addTextField { myTextField in
            myTextField.placeholder = placeholder
        }
        return alertVC
    }
}
