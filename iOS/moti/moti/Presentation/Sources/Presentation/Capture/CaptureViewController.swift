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

protocol CaptureViewControllerDelegate: AnyObject {
    func didCapture()
}

final class CaptureViewController: BaseViewController<CaptureView> {
    
    // MARK: - Properties
    weak var delegate: CaptureViewControllerDelegate?
    weak var coordinator: CaptureCoordinator?
    
    private let categories: [String] = ["카테고리1", "카테고리2", "카테고리3", "카테고리4", "카테고리5"]
    private var bottomSheet = InputTextViewController()

    // Capture Session
    private var session: AVCaptureSession?
    
    // Photo Output
    private var output: AVCapturePhotoOutput?
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        addTargets()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        checkCameraPermissions()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        Logger.debug("Session Stop Running")
        if let session = session, session.isRunning {
            session.stopRunning()
        }
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
        guard let device = AVCaptureDevice.default(for: .video) else { return }
        
        // 세션을 만들고 input, output 연결
        let session = AVCaptureSession()
        session.sessionPreset = .photo
        do {
            let input = try AVCaptureDeviceInput(device: device)
            if session.canAddInput(input) {
                session.addInput(input)
                Logger.debug("Add AVCaptureDeviceInput")
            }
            
            output = AVCapturePhotoOutput()
            if let output = output,
                session.canAddOutput(output) {
                session.addOutput(output)
                Logger.debug("Add AVCapturePhotoOutput")
            }

            layoutView.updatePreviewLayer(session: session)
            
            DispatchQueue.global().async {
                if !session.isRunning {
                    Logger.debug("Session Start Running")
                    session.startRunning()
                } else {
                    Logger.debug("Session Already Running")
                }
            }
            self.session = session
                
        } catch {
            Logger.debug(error)
        }
    }
    
    func startCapture() {
        setupCamera()
        layoutView.captureMode()
    }
    
    @objc private func didClickedShutterButton() {
        
        // 사진 찍기!
        #if targetEnvironment(simulator)
        // Simulator
        Logger.debug("시뮬레이터에선 카메라를 테스트할 수 없습니다. 실기기를 연결해 주세요.")
        delegate?.didCapture()
        layoutView.editMode(image: MotiImage.sample1)
        #else
        // TODO: PhotoQualityPrioritization 옵션별로 비교해서 최종 결정해야 함
        // - speed: 약간의 노이즈 감소만이 적용
        // - balanced: speed보다 약간 더 느리지만 더 나은 품질을 얻음
        // - quality: 현대 디바이스나 밝기에 따라 많은 시간을 사용하여 최상의 품질을 만듬
        
        // 빠른 속도를 위해 speed를 사용하려 했지만
        // WWDC 2021 - Capture high-quality photos using video formats에서 speed보다 balanced를 추천 (기본이 balanced임)
        // 만약 사진과 비디오가 동일하게 보여야 하면 speed를 사용
    
        // Actual Device
        let setting = AVCapturePhotoSettings()
        setting.photoQualityPrioritization = .balanced
        output?.capturePhoto(with: setting, delegate: self)
        #endif
    }
}

extension CaptureViewController: AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        // 카메라 세션 끊기, 끊지 않으면 여러번 사진 찍기 가능
        if let session = session, session.isRunning {
            session.stopRunning()
        }
        
        guard let data = photo.fileDataRepresentation() else { return }
        
        if let image = convertDataToImage(data) {
            delegate?.didCapture()
            layoutView.editMode(image: image)
        }
    }
    
    private func convertDataToImage(_ data: Data) -> UIImage? {
        guard let image = UIImage(data: data) else { return nil }
        
        #if DEBUG
            Logger.debug("이미지 사이즈: \(image.size)")
            Logger.debug("이미지 용량: \(data) / \(data.count / 1000) KB\n")
        #endif
        return image
    }
    
    private func cropImage(image: UIImage, rect: CGRect) -> UIImage {
        guard let imageRef = image.cgImage?.cropping(to: rect) else {
            return image
        }
        
        let croppedImage = UIImage(cgImage: imageRef)
        return croppedImage
    }
}
