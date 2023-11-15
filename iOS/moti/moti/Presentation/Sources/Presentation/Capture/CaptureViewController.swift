//
//  CaptureViewController.swift
//  
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Core

final class CaptureViewController: BaseViewController<CaptureView> {
    
    // MARK: - Properties
    weak var coordinator: CaptureCoordinator?
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        coordinator?.finish()
    }
    
    // MARK: - Methods
    private func setupUI() {
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "취소", style: .plain, target: self, action: #selector(leftButtonAction))
    }
    
    @objc private func leftButtonAction() {
        coordinator?.finish()
    }
}
