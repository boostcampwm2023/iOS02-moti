//
//  CaptureViewController.swift
//  
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Core
import Design

final class CaptureViewController: UIViewController {

    // MARK: - Views
    let photoButton = NormalButton(title: "앨범에서 선택", image: SymbolImage.photo)
    let cameraSwitchingButton = NormalButton(title: "카메라 전환", image: SymbolImage.iphone)
    
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
        view.backgroundColor = .motiBackground
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "취소", style: .plain, target: self, action: #selector(leftButtonAction))
        
        setupPhotoButton()
        setupCameraSwitchingButton()
    }
    
    @objc private func leftButtonAction() {
        coordinator?.finish()
    }
    
    private func setupPhotoButton() {
        photoButton.setColor(.lightGray)
        view.addSubview(photoButton)
        photoButton.atl
            .bottom(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20)
            .left(equalTo: view.safeAreaLayoutGuide.leftAnchor, constant: 15)
    }
    
    private func setupCameraSwitchingButton() {
        cameraSwitchingButton.setColor(.lightGray)
        view.addSubview(cameraSwitchingButton)
        cameraSwitchingButton.atl
            .bottom(equalTo: photoButton.bottomAnchor)
            .right(equalTo: view.safeAreaLayoutGuide.rightAnchor, constant: -15)
    }
}
