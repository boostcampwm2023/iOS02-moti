//
//  BaseViewController.swift
//  
//
//  Created by Kihyun Lee on 11/9/23.
//

import UIKit
import Design

class BaseViewController<LayoutView: UIView>: UIViewController {
    var layoutView = LayoutView()
    
    override func loadView() {
        if layoutView.backgroundColor == nil {
            layoutView.backgroundColor = .motiBackground
        }
        view = layoutView
    }
    
    func showOneButtonAlert(
        title: String? = nil,
        message: String? = nil,
        okTitle: String? = "확인",
        okAction: (() -> Void)? = nil
    ) {
        let alertVC = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAlert = UIAlertAction(title: okTitle, style: .default) { _ in
            okAction?()
        }
        
        alertVC.addAction(okAlert)
        present(alertVC, animated: true)
    }
    
    func showTwoButtonAlert(
        title: String? = nil,
        message: String? = nil,
        okTitle: String? = "확인",
        okAction: (() -> Void)? = nil
    ) {
        let alertVC = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAlert = UIAlertAction(title: okTitle, style: .default) { _ in
            okAction?()
        }
        let cancelAlert = UIAlertAction(title: "취소", style: .cancel)
        
        alertVC.addAction(cancelAlert)
        alertVC.addAction(okAlert)
        present(alertVC, animated: true)
    }
    
    func showTextFieldAlert(
        title: String? = nil,
        okTitle: String? = "OK",
        placeholder: String? = nil,
        okAction: ((String?) -> Void)? = nil
    ) {
        let alertVC = AlertFactory.makeTextFieldAlert(
            title: "추가할 카테고리 이름을 입력하세요.",
            okTitle: "생성",
            placeholder: "카테고리 이름은 최대 10글자입니다.",
            okAction: okAction
        )
        present(alertVC, animated: true)
    }
}
