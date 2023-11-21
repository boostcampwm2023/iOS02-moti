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
    private let preview = {
        let view = UIView()
        view.backgroundColor = .primaryGray
        return view
    }()
    
    let captureButton = CaptureButton() // VC에서 액션을 달아주기 위해 private 제거
    
    let achievementView = {
        let achievementView = AchievementView()
        achievementView.isHidden = true
        return achievementView
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
    func updatePreviewLayer(session: AVCaptureSession) {
        previewLayer.session = session
        captureMode()
    }
    
    func captureMode() {
        preview.isHidden = false
        achievementView.isHidden = true
        
        photoButton.isHidden = false
        cameraSwitchingButton.isHidden = false
        captureButton.isHidden = false
    }
    
    func editMode(image: UIImage) {
        preview.isHidden = true
        achievementView.update(image: image)
        achievementView.isHidden = false
        
        photoButton.isHidden = true
        cameraSwitchingButton.isHidden = true
        captureButton.isHidden = true
    }
    
    private func setupUI() {
        setupAchievementView()
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
    
    private func setupAchievementView() {
        addSubview(achievementView)
        achievementView.atl
            .top(equalTo: safeAreaLayoutGuide.topAnchor, constant: 20)
            .horizontal(equalTo: safeAreaLayoutGuide)
    }
    
    private func setupPreview() {
        // 카메라 Preview
        addSubview(preview)
        preview.atl
            .height(equalTo: preview.widthAnchor)
            .top(equalTo: achievementView.resultImageView.topAnchor)
            .horizontal(equalTo: safeAreaLayoutGuide)
        
        // PreviewLayer를 Preview 에 넣기
        previewLayer.backgroundColor = UIColor.primaryGray.cgColor
        previewLayer.videoGravity = .resizeAspectFill
        preview.layer.addSublayer(previewLayer)
    }
}
