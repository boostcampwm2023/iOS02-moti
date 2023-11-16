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
    let previewTopPadding: CGFloat = 100
    let previewLayer = AVCaptureVideoPreviewLayer()
    let preview = UIView()
    
    let shutterButton = CaptureButton() // VC에서 액션을 달아주기 위해 private 제거
    
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
    private func setupUI() {
        setupPhotoButton()
        setupCameraSwitchingButton()
        setupShutterButton()
        setupPreview()
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
    
    func replacePreview(with image: UIImage) {
        let imageView = UIImageView(image: image)
        imageView.contentMode = .scaleAspectFill
        imageView.clipsToBounds = true
        
        addSubview(imageView)
        imageView.atl
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
        previewLayer.backgroundColor = UIColor.lightGray.cgColor
        preview.layer.addSublayer(previewLayer)
    }
}
