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
        okAction: @escaping () -> Void
    ) -> UIAlertController {
        let alertVC = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAlert = UIAlertAction(title: "OK", style: .default) { _ in
            okAction()
        }
        let cancelAlert = UIAlertAction(title: "cancel", style: .cancel)
        
        alertVC.addAction(cancelAlert)
        alertVC.addAction(okAlert)
        return alertVC
    }
    
    public static func makeTextFieldAlert(
        title: String? = nil,
        message: String? = nil,
        placeholder: String? = nil,
        okAction: @escaping (String?) -> Void
    ) -> UIAlertController {
        let alertVC = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAlert = UIAlertAction(title: "OK", style: .default) { _ in
            okAction(alertVC.textFields?[0].text)
        }
        let cancelAlert = UIAlertAction(title: "cancel", style: .cancel)
        
        alertVC.addAction(cancelAlert)
        alertVC.addAction(okAlert)
        alertVC.addTextField { myTextField in
            myTextField.placeholder = placeholder
        }
        return alertVC
    }
}
