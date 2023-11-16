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
    private var session: AVCaptureSession?
    
    // Photo Output
    private let output = AVCapturePhotoOutput()
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        addTargets()
        
        checkCameraPermissions()
    }
    
    // MARK: - Methods
    private func addTargets() {
        layoutView.captureButton.addTarget(self, action: #selector(didClickedShutterButton), for: .touchUpInside)
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
        guard let device = AVCaptureDevice.default(for: .video) else { return }
        do {
            let input = try AVCaptureDeviceInput(device: device)
            if session.canAddInput(input) {
                session.addInput(input)
            }
            
            if session.canAddOutput(output) {
                session.addOutput(output)
            }
            
            layoutView.updatePreviewLayer(session: session)
            
            DispatchQueue.global().async {
                session.startRunning()
            }
            self.session = session
                
        } catch {
            Logger.debug(error)
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
        guard let data = photo.fileDataRepresentation(), 
              let image = UIImage(data: data) else { return }
        Logger.debug("이미지 사이즈: \(image.size)")
        Logger.debug("이미지 용량: \(data)")
        Logger.debug("이미지 용량: \(data.count / 1000) KB\n")
        
        // 카메라 세션 끊기, 끊지 않으면 여러번 사진 찍기 가능
        session?.stopRunning()
        
        layoutView.updatePreview(with: image)
    }
}
