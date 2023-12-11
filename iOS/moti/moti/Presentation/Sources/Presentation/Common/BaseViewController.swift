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
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        // 탭바를 숨겨야 하는 VC는 일괄 적용
        (self as? HiddenTabBarViewController)?.hideTabBar()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        // 탭바를 보겨야 하는 VC는 일괄 적용
        (self as? HiddenTabBarViewController)?.showTabBar()
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
        DispatchQueue.main.async {
            let alertVC = AlertFactory.makeOneButtonAlert(title: title, message: message, okAction: okAction)
            self.present(alertVC, animated: true)
        }
    }
    
    /// 버튼이 하나인 일반 Alert
    func showOneButtonAlert(
        title: String? = nil,
        message: String? = nil,
        okTitle: String? = "확인",
        okAction: (() -> Void)? = nil
    ) {
        DispatchQueue.main.async {
            let alertVC = AlertFactory.makeOneButtonAlert(title: title, message: message, okTitle: okTitle, okAction: okAction)
            self.present(alertVC, animated: true)
        }
    }
    
    /// 버튼이 두 개인 일반 Alert
    func showTwoButtonAlert(
        title: String? = nil,
        message: String? = nil,
        okTitle: String? = "확인",
        okAction: (() -> Void)? = nil,
        cancelTitle: String? = "취소",
        cancelAction: (() -> Void)? = nil
    ) {
        DispatchQueue.main.async {
            let alertVC = AlertFactory.makeTwoButtonAlert(
                title: title,
                message: message,
                okTitle: okTitle,
                okAction: okAction,
                cancelTitle: cancelTitle,
                cancelAction: cancelAction
            )
            self.present(alertVC, animated: true)
        }
    }
    
    func showDestructiveTwoButtonAlert(
        title: String? = nil,
        message: String? = nil,
        okTitle: String? = "삭제",
        okAction: (() -> Void)? = nil
    ) {
        DispatchQueue.main.async {
            let alertVC = AlertFactory.makeDestructiveTwoButtonAlert(title: title, message: message, okTitle: okTitle, okAction: okAction)
            self.present(alertVC, animated: true)
        }
    }
    
    func showTextFieldAlert(
        title: String? = nil,
        okTitle: String? = "OK",
        placeholder: String? = nil,
        okAction: ((String?) -> Void)? = nil
    ) {
        DispatchQueue.main.async {
            let alertVC = AlertFactory.makeTextFieldAlert(title: title, okTitle: okTitle, placeholder: placeholder, okAction: okAction)
            self.present(alertVC, animated: true)
        }
    }
}
