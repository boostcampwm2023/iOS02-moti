//
//  AlertFactory.swift
//  
//
//  Created by Kihyun Lee on 11/20/23.
//

import UIKit

public enum AlertFactory {
    public static func makeNormalAlert(
        title: String? = nil,
        message: String? = nil,
        okTitle: String? = "확인",
        okAction: (() -> Void)? = nil
    ) -> UIAlertController {
        let alertVC = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAlert = UIAlertAction(title: okTitle, style: .default) { _ in
            okAction?()
        }
        let cancelAlert = UIAlertAction(title: "취소", style: .cancel)
        
        alertVC.addAction(cancelAlert)
        alertVC.addAction(okAlert)
        return alertVC
    }
    
    public static func makeOneButtonAlert(
        title: String? = nil,
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
    
    public static func makeTextFieldAlert(
        title: String? = nil,
        okTitle: String? = "OK",
        placeholder: String? = nil,
        okAction: @escaping (String?) -> Void
    ) -> UIAlertController {
        let alertVC = UIAlertController(title: title, message: nil, preferredStyle: .alert)
        let okAlert = UIAlertAction(title: okTitle, style: .default) { _ in
            okAction(alertVC.textFields?[0].text)
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
