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
    private let preview = {
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
    
    // 편집 뷰
    let achievementView = {
        let achievementView = AchievementView()
        achievementView.isHidden = true
        return achievementView
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
        previewLayer.frame = preview.bounds
    }
    
    // MARK: - Methods
    func updatePreviewLayer(session: AVCaptureSession) {
        previewLayer.session = session
    }
    
    func changeToCaptureMode() {
        preview.isHidden = false
        albumButton.isHidden = false
        cameraSwitchingButton.isHidden = false
        captureButton.isHidden = false
        
        achievementView.resultImageView.image = nil
        achievementView.isHidden = true
    }
    
    func changeToEditMode(image: UIImage) {
        preview.isHidden = true
        albumButton.isHidden = true
        cameraSwitchingButton.isHidden = true
        captureButton.isHidden = true
        
        achievementView.isHidden = false
        achievementView.configureEdit(image: image)
    }
    
    func changeToBackCamera() {
        cameraSwitchingButton.setImage(SymbolImage.iphone, for: .normal)
    }
    
    func changeToFrontCamera() {
        cameraSwitchingButton.setImage(SymbolImage.iphoneCamera, for: .normal)
    }
}

// MARK: - Setup
private extension CaptureView {
    func setupUI() {
        setupAchievementView()
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
    
    func setupAchievementView() {
        addSubview(achievementView)
        achievementView.atl
            .top(equalTo: safeAreaLayoutGuide.topAnchor)
            .bottom(equalTo: bottomAnchor)
            .horizontal(equalTo: safeAreaLayoutGuide)
    }
    
    func setupPreview() {
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
