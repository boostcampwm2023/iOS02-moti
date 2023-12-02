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
}

// MARK: - Alert
extension BaseViewController {
    /// 에러 상황일 때 호출하는 Alert
    func showErrorAlert(
        title: String = "에러",
        message: String? = nil,
        okAction: (() -> Void)? = nil
    ) {
        let alertVC = AlertFactory.makeOneButtonAlert(title: title, message: message, okAction: okAction)
        present(alertVC, animated: true)
    }
    
    /// 버튼이 하나인 일반 Alert
    func showOneButtonAlert(
        title: String? = nil,
        message: String? = nil,
        okTitle: String? = "확인",
        okAction: (() -> Void)? = nil
    ) {
        let alertVC = AlertFactory.makeOneButtonAlert(title: title, message: message, okTitle: okTitle, okAction: okAction)
        present(alertVC, animated: true)
    }
    
    /// 버튼이 두 개인 일반 Alert
    func showTwoButtonAlert(
        title: String? = nil,
        message: String? = nil,
        okTitle: String? = "확인",
        okAction: (() -> Void)? = nil
    ) {
        let alertVC = AlertFactory.makeTwoButtonAlert(
            title: title,
            message: message,
            okTitle: okTitle,
            okAction: okAction,
            cancelTitle: "취소"
        )
        present(alertVC, animated: true)
    }
    
    func showDestructiveTwoButtonAlert(
        title: String? = nil,
        message: String? = nil,
        okTitle: String? = "삭제",
        okAction: (() -> Void)? = nil
    ) {
        let alertVC = AlertFactory.makeDestructiveTwoButtonAlert(title: title, message: message, okTitle: okTitle, okAction: okAction)
        present(alertVC, animated: true)
    }
    
    func showTextFieldAlert(
        title: String? = nil,
        okTitle: String? = "OK",
        placeholder: String? = nil,
        okAction: ((String?) -> Void)? = nil
    ) {
        let alertVC = AlertFactory.makeTextFieldAlert(title: title, okTitle: okTitle, placeholder: placeholder, okAction: okAction)
        present(alertVC, animated: true)
    }
}
