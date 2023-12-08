//
//  CaptureView.swift
//
//
//  Created by Kihyun Lee on 11/15/23.
//

import UIKit
import Design
import AVFoundation

final class CaptureView: UIView {
    
    // MARK: - Views
    // VC에서 액션을 달아주기 위해 private 제거
    let albumButton = NormalButton(title: "앨범에서 선택", image: SymbolImage.photo)
    let cameraSwitchingButton = {
        let button = NormalButton()
        button.setTitle("카메라 전환", for: .normal)
        return button
    }()
    let captureButton = CaptureButton()

    // Video Preview
    let preview = {
        let view = UIView()
        view.backgroundColor = .primaryGray
        return view
    }()

    private let previewLayer = {
        let previewLayer = AVCaptureVideoPreviewLayer()
        previewLayer.videoGravity = .resizeAspectFill
        // portrait 고정
        if #available(iOS 17.0, *) {
            previewLayer.connection?.videoRotationAngle = 90
        } else {
            previewLayer.connection?.videoOrientation = .portrait
        }
        return previewLayer
    }()
    
    // MARK: - Init
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        
        // 프리뷰 레이어 조정
        updatePreviewConstraint()
        previewLayer.frame = preview.bounds
    }
    
    // MARK: - Methods
    func updatePreviewLayer(session: AVCaptureSession) {
        previewLayer.session = session
    }
    
    func changeToBackCamera() {
        cameraSwitchingButton.setImage(SymbolImage.iphone, for: .normal)
        UIView.transition(
            with: cameraSwitchingButton,
            duration: 0.2,
            options: .transitionFlipFromLeft,
            animations: nil,
            completion: nil
        )
        
        UIView.transition(
            with: preview,
            duration: 0.2,
            options: .transitionFlipFromLeft,
            animations: nil,
            completion: nil
        )
    }
    
    func changeToFrontCamera() {
        cameraSwitchingButton.setImage(SymbolImage.iphoneCamera, for: .normal)
        UIView.transition(
            with: cameraSwitchingButton,
            duration: 0.2,
            options: .transitionFlipFromRight,
            animations: nil,
            completion: nil
        )
        
        UIView.transition(
            with: preview,
            duration: 0.2,
            options: .transitionFlipFromRight,
            animations: nil, 
            completion: nil
        )
    }
}

// MARK: - Setup
private extension CaptureView {
    func setupUI() {
        setupPreview()
        
        setupCaptureButton()
        setupPhotoButton()
        setupCameraSwitchingButton()
    }
    
    func setupCaptureButton() {
        addSubview(captureButton)
        captureButton.atl
            .size(width: CaptureButton.defaultSize, height: CaptureButton.defaultSize)
            .centerX(equalTo: centerXAnchor)
            .bottom(equalTo: bottomAnchor, constant: -36)
    }

    func setupPhotoButton() {
        albumButton.setColor(.tabBarItemGray)
        addSubview(albumButton)
        albumButton.atl
            .bottom(equalTo: captureButton.bottomAnchor)
            .right(equalTo: captureButton.leftAnchor, constant: -30)
    }
    
    func setupCameraSwitchingButton() {
        cameraSwitchingButton.setColor(.tabBarItemGray)
        addSubview(cameraSwitchingButton)
        cameraSwitchingButton.atl
            .bottom(equalTo: captureButton.bottomAnchor)
            .left(equalTo: captureButton.rightAnchor, constant: 30)
    }
    
    func setupPreview() {
        // 카메라 Preview
        addSubview(preview)
        
        // PreviewLayer를 Preview 에 넣기
        previewLayer.backgroundColor = UIColor.primaryGray.cgColor
        previewLayer.videoGravity = .resizeAspectFill
        preview.layer.addSublayer(previewLayer)
    }
    
    private func updatePreviewConstraint() {
        if let bounds = window?.windowScene?.screen.bounds, let window {
            NSLayoutConstraint.deactivate(preview.constraints)
            
            let minSize = min(400, bounds.width, bounds.height)
            preview.atl
                .size(width: minSize, height: minSize)
                .centerX(equalTo: safeAreaLayoutGuide.centerXAnchor)
                .centerY(equalTo: window.centerYAnchor, constant: -20)
        }
    }
}
