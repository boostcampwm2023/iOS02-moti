//
//  LaunchViewController.swift
//  moti
//
//  Created by 유정주 on 11/8/23.
//

import UIKit

final class LaunchViewController: BaseViewController<LaunchView> {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 임시 화면 이동 코드
        Task {
            sleep(1)
            
            let loginVC = LoginViewController()
            loginVC.modalPresentationStyle = .fullScreen
            dismiss(animated: false)
            present(loginVC, animated: false)
        }
    }
}
