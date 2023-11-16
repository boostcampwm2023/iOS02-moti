//
//  CaptureView.swift
//
//
//  Created by Kihyun Lee on 11/15/23.
//

import UIKit
import Design

final class CaptureView: UIView {
    
    // MARK: - Views
    private let photoButton = NormalButton(title: "앨범에서 선택", image: SymbolImage.photo)
    private let cameraSwitchingButton = NormalButton(title: "카메라 전환", image: SymbolImage.iphone)
    
    let shutterButton = CaptureButton() // VC에서 액션을 달아주기 위해 private 제거
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    // MARK: - Methods
    private func setupUI() {
        setupPhotoButton()
        setupCameraSwitchingButton()
        setupShutterButton()
    }
    
    private func setupPhotoButton() {
        photoButton.setColor(.lightGray)
        addSubview(photoButton)
        photoButton.atl
            .bottom(equalTo: safeAreaLayoutGuide.bottomAnchor, constant: -20)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 15)
    }
    
    private func setupCameraSwitchingButton() {
        cameraSwitchingButton.setColor(.lightGray)
        addSubview(cameraSwitchingButton)
        cameraSwitchingButton.atl
            .bottom(equalTo: photoButton.bottomAnchor)
            .right(equalTo: safeAreaLayoutGuide.rightAnchor, constant: -15)
    }
    
    private func setupShutterButton() {
        addSubview(shutterButton)
        shutterButton.atl
            .size(width: CaptureButton.defaultSize, height: CaptureButton.defaultSize)
            .centerX(equalTo: centerXAnchor)
            .bottom(equalTo: safeAreaLayoutGuide.bottomAnchor, constant: -36)
    }
}
