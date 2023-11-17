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
    private let photoButton = NormalButton(title: "앨범에서 선택", image: SymbolImage.photo)
    private let cameraSwitchingButton = NormalButton(title: "카메라 전환", image: SymbolImage.iphone)
    
    // Video Preview
    private let previewTopPadding: CGFloat = 100
    private let previewLayer = AVCaptureVideoPreviewLayer()
    private let preview = UIView()
    
    let captureButton = CaptureButton() // VC에서 액션을 달아주기 위해 private 제거
    private let resultImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.contentMode = .scaleAspectFill
        imageView.clipsToBounds = true
        imageView.isHidden = true
        return imageView
    }()
    
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
        previewLayer.frame = preview.bounds
    }
    
    // MARK: - Methods
    func updatePreview(with image: UIImage) {
        resultImageView.isHidden = false
        resultImageView.image = image
    }
    
    func updatePreviewLayer(session: AVCaptureSession) {
        resultImageView.isHidden = true
        previewLayer.session = session
    }
    
    private func setupUI() {
        setupPreview()
        
        setupCaptureButton()
        setupPhotoButton()
        setupCameraSwitchingButton()
    }
    
    private func setupCaptureButton() {
        addSubview(captureButton)
        captureButton.atl
            .size(width: CaptureButton.defaultSize, height: CaptureButton.defaultSize)
            .centerX(equalTo: centerXAnchor)
            .bottom(equalTo: bottomAnchor, constant: -36)
    }

    private func setupPhotoButton() {
        photoButton.setColor(.tabBarItemGray)
        addSubview(photoButton)
        photoButton.atl
            .bottom(equalTo: captureButton.bottomAnchor)
            .right(equalTo: captureButton.leftAnchor, constant: -30)
    }
    
    private func setupCameraSwitchingButton() {
        cameraSwitchingButton.setColor(.tabBarItemGray)
        addSubview(cameraSwitchingButton)
        cameraSwitchingButton.atl
            .bottom(equalTo: captureButton.bottomAnchor)
            .left(equalTo: captureButton.rightAnchor, constant: 30)
    }
    
    private func setupResultImageView() {
        addSubview(resultImageView)
        resultImageView.atl
            .all(of: preview)
    }
    
    private func setupPreview() {
        // 카메라 Preview
        addSubview(preview)
        preview.atl
            .top(equalTo: safeAreaLayoutGuide.topAnchor, constant: previewTopPadding)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor)
            .right(equalTo: safeAreaLayoutGuide.rightAnchor)
            .height(equalTo: preview.widthAnchor)
        
        // PreviewLayer를 Preview 에 넣기
        previewLayer.backgroundColor = UIColor.primaryGray.cgColor
        previewLayer.videoGravity = .resizeAspectFill
        preview.layer.addSublayer(previewLayer)
    }
}
