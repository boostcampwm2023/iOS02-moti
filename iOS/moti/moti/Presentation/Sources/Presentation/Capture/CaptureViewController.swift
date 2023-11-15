//
//  CaptureViewController.swift
//  
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Core

class CaptureViewController: UIViewController {

    // MARK: - Properties
    weak var coordinator: CaptureCoordinator?
    
    // MARK: - View
    private let cancelButton: UIButton = {
        let button = UIButton()
        button.setTitle("취소", for: .normal)
        button.setTitleColor(.primaryBlue, for: .normal)
        button.setTitleColor(.normalButtonHighlightColor, for: .highlighted)
        return button
    }()
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupUI()
    }
    
    // MARK: - Methods
    private func setupUI() {
        view.backgroundColor = .motiBackground
        setupCancelButton()
        addTarget()
    }
    
    private func setupCancelButton() {
        view.addSubview(cancelButton)
        cancelButton.atl
            .top(equalTo: self.view.safeAreaLayoutGuide.topAnchor, constant: 20)
            .left(equalTo: self.view.safeAreaLayoutGuide.leftAnchor, constant: 15)
    }
    
    private func addTarget() {
        cancelButton.addTarget(self, action: #selector(leftButtonAction), for: .touchUpInside)
    }
    
    @objc private func leftButtonAction() {
        print("left button!")
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        coordinator?.finish()
    }
}
