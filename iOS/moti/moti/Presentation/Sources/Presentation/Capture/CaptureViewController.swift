//
//  CaptureViewController.swift
//  
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Core
import AVFoundation
import Design

final class CaptureViewController: BaseViewController<CaptureView> {
    
    // MARK: - Properties
    weak var coordinator: CaptureCoordinator?
    
    // Capture Session
    var session: AVCaptureSession?
    
    // Photo Output
    let output = AVCapturePhotoOutput()
    
    // Video Preview
    let previewTopPadding: CGFloat = 100
    let previewLayer = AVCaptureVideoPreviewLayer()
    let preview = UIView()
    
    // Shutter Button
    let shutterButton = CaptureButton()
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        
        checkCameraPermissions()
    }
    
    override func viewDidLayoutSubviews() {
        // 프리뷰 레이어 조정
        previewLayer.frame = preview.bounds
    }
    
    // MARK: - Methods
    private func setupUI() {
        setupPreview()
        setupShutterButton()
    }
    
    private func setupPreview() {
        // 카메라 Preview
        view.addSubview(preview)
        preview.atl
            .height(constant: UIScreen.main.bounds.size.width)
            .top(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: previewTopPadding)
            .left(equalTo: view.safeAreaLayoutGuide.leftAnchor)
            .right(equalTo: view.safeAreaLayoutGuide.rightAnchor)
        
        // PreviewLayer를 Preview 에 넣기
        previewLayer.backgroundColor = UIColor.lightGray.cgColor
        preview.layer.addSublayer(previewLayer)
    }
    
    private func setupShutterButton() {
        // 카메라 셔터 버튼
        view.addSubview(shutterButton)
        shutterButton.atl
            .size(width: CaptureButton.defaultSize, height: CaptureButton.defaultSize)
            .centerX(equalTo: view.centerXAnchor)
            .bottom(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -36)
        
        shutterButton.addTarget(self, action: #selector(didClickedShutterButton), for: .touchUpInside)
    }

    private func checkCameraPermissions() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .notDetermined: // 첫 권한 요청
            AVCaptureDevice.requestAccess(for: .video) { [weak self] isAllowed in
                guard isAllowed else { return } // 사용자가 권한 거부
                
                DispatchQueue.main.async { // 사용자가 권한 허용
                    self?.setupCamera()
                }
            }
        case .restricted: // 제한
            Logger.debug("권한 제한")
        case .denied: // 이미 권한 거부 되어 있는 상태
            Logger.debug("권한 거부")
        case .authorized: // 이미 권한 허용되어 있는 상태
            Logger.debug("권한 허용")
            setupCamera()
        @unknown default:
            break
        }
    }

    private func setupCamera() {
        // 세션을 만들고 input, output 연결
        let session = AVCaptureSession()
        if let device = AVCaptureDevice.default(for: .video) {
            do {
                let input = try AVCaptureDeviceInput(device: device)
                if session.canAddInput(input) {
                    session.addInput(input)
                }
                
                if session.canAddOutput(output) {
                    session.addOutput(output)
                }
                
                previewLayer.videoGravity = .resizeAspectFill
                previewLayer.session = session
                
                DispatchQueue.global().async {
                    session.startRunning()
                }
                self.session = session
                    
            } catch {
                Logger.debug(error)
            }
        }
    }
    
    @objc private func didClickedShutterButton() {
        // 사진 찍기!
        #if targetEnvironment(simulator)
            // Simulator
            Logger.debug("시뮬레이터에선 카메라를 테스트할 수 없습니다. 실기기를 연결해 주세요.")
        #else
            // Actual Device
            output.capturePhoto(with: AVCapturePhotoSettings(),
                                delegate: self)
        #endif
    }
}

extension CaptureViewController: AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        guard let data = photo.fileDataRepresentation() else {
            return
        }
        guard let image = UIImage(data: data) else { return }
        Logger.debug("이미지 사이즈: \(image.size)")
        Logger.debug("이미지 용량: \(data)")
        Logger.debug("이미지 용량: \(data.count / 1000) KB\n")
        
        // 카메라 세션 끊기, 끊지 않으면 여러번 사진 찍기 가능
         session?.stopRunning()
        
        let imageView = UIImageView(image: image)
        imageView.contentMode = .scaleAspectFill
        imageView.clipsToBounds = true
        
        view.addSubview(imageView)
        imageView.atl
            .all(of: preview)
    }
}
