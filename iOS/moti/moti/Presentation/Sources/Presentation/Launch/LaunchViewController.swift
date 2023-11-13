//
//  LaunchViewController.swift
//  moti
//
//  Created by 유정주 on 11/8/23.
//

import UIKit

protocol LaunchViewControllerDelegate: AnyObject {
    func viewControllerDidLogin(isSuccess: Bool)
}

final class LaunchViewController: BaseViewController<LaunchView> {
    
    weak var delegate: LaunchViewControllerDelegate?
    
    override func viewDidLoad() {
        super.viewDidLoad()
    
        // 임시 화면 이동 코드
        Task {
            sleep(1)
            delegate?.viewControllerDidLogin(isSuccess: true)
            dismiss(animated: false)
        }
    }
}
