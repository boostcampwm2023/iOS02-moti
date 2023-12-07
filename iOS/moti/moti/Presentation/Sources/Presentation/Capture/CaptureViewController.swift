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
import PhotosUI
import Domain
import Jeongfisher

protocol CaptureViewControllerDelegate: AnyObject {
    func didCapture(image: UIImage)
}

final class CaptureViewController: BaseViewController<CaptureView>, VibrationViewController {
    
    // MARK: - Properties
    weak var delegate: CaptureViewControllerDelegate?
    weak var coordinator: CaptureCoordinator?
    private let group: Group?

    // Capture Session
    private var isBackCamera = true
    private var session: AVCaptureSession?
    private var backCameraInput: AVCaptureDeviceInput?
    private var frontCameraInput: AVCaptureDeviceInput?
    
    // Photo Output
    private var output: AVCapturePhotoOutput?
    
    // MARK: - Init
    init(group: Group? = nil) {
        self.group = group
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        addTargets()
        checkCameraPermissions()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        startSession()
        layoutView.captureButton.isEnabled = true
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        stopSession()
    }
    
    // MARK: - Methods
    private func addTargets() {
        layoutView.captureButton.addTarget(self, action: #selector(didClickedShutterButton), for: .touchUpInside)
        layoutView.albumButton.addTarget(self, action: #selector(showPHPicker), for: .touchUpInside)
        layoutView.cameraSwitchingButton.addTarget(self, action: #selector(switchCameraInput), for: .touchUpInside)
    }
    
    private func capturedPicture(image: UIImage) {
        guard let croppedImage = image.cropToSquare() else { return }
        
        // 앨범에서 선택도 가능하기 때문에 해당 위치에서 다운샘플링 진행
        let size = layoutView.preview.frame.size
        guard let data = croppedImage.jpegData(compressionQuality: 1.0),
              let downsampledImage = data.downsampling(to: size, scale: 3) else { return }
        
        #if DEBUG
        Logger.debug("프리뷰 사이즈: \(size)")
        Logger.debug("다운샘플링 이미지 사이즈: \(downsampledImage.size)")
        #endif
        
        delegate?.didCapture(image: downsampledImage)
    }
}

// MARK: - Camera
extension CaptureViewController {
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
        setupBackCamera()
        setupFrontCamera()
        
        // 아무런 카메라도 없으면 메서드 종료
        if backCameraInput == nil && frontCameraInput == nil {
            return
        }
        
        // 세션을 만들고 input, output 연결
        let session = AVCaptureSession()
        session.beginConfiguration()
        
        if session.canSetSessionPreset(.photo) {
            session.sessionPreset = .photo
        }
        
        if isBackCamera,
           let backCameraInput = backCameraInput, session.canAddInput(backCameraInput) {
            session.addInput(backCameraInput)
        } else if let frontCameraInput = frontCameraInput, session.canAddInput(frontCameraInput) {
            session.addInput(frontCameraInput)
        }
        
        output = AVCapturePhotoOutput()
        if let output = output,
            session.canAddOutput(output) {
            session.addOutput(output)
            Logger.debug("Add AVCapturePhotoOutput")
        }
        
        session.commitConfiguration()
        self.session = session
        
        if isBackCamera {
            layoutView.changeToBackCamera()
        } else {
            layoutView.changeToFrontCamera()
        }
        
        startSession()
    }
    
    // 후면 카메라 설정
    private func setupBackCamera() {
        if let backCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back),
           let backCameraInput = try? AVCaptureDeviceInput(device: backCamera) {
            self.backCameraInput = backCameraInput
        } else {
            Logger.error("후면 카메라를 추가할 수 없음")
        }
    }
    
    // 전면 카메라 설정
    private func setupFrontCamera() {
        if let frontCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front),
           let frontCameraInput = try? AVCaptureDeviceInput(device: frontCamera) {
            self.frontCameraInput = frontCameraInput
        } else {
            Logger.error("전면 카메라를 추가할 수 없음")
        }
    }
    
    private func startSession() {
        guard let session = session else { return }
        
        layoutView.updatePreviewLayer(session: session)
        layoutView.captureButton.isEnabled = true
        DispatchQueue.global().async {
            if !session.isRunning {
                Logger.debug("Session Start Running")
                session.startRunning()
            }
        }
    }
    
    private func stopSession() {
        guard let session = session else { return }
        
        layoutView.captureButton.isEnabled = false
        DispatchQueue.global().async {
            if session.isRunning {
                Logger.debug("Session Stop Running")
                session.stopRunning()
            }
        }
    }

    @objc private func didClickedShutterButton() {
        vibration(.soft)
        layoutView.captureButton.isEnabled = false
        // 사진 찍기!
        #if targetEnvironment(simulator)
        // Simulator
        Logger.debug("시뮬레이터에선 카메라를 테스트할 수 없습니다. 실기기를 연결해 주세요.")
        let randomImage = [
            MotiImage.sample1, MotiImage.sample2, MotiImage.sample3,
            MotiImage.sample4, MotiImage.sample5, MotiImage.sample6, MotiImage.sample7
        ].randomElement()!
        capturedPicture(image: randomImage)
        #else
        // - speed: 약간의 노이즈 감소만이 적용
        // - balanced: speed보다 약간 더 느리지만 더 나은 품질을 얻음
        // - quality: 현대 디바이스나 밝기에 따라 많은 시간을 사용하여 최상의 품질을 만듬
        
        // 빠른 속도를 위해 speed를 사용하려 했지만
        // WWDC 2021 - Capture high-quality photos using video formats에서 speed보다 balanced를 추천 (기본이 balanced임)
        // 만약 사진과 비디오가 동일하게 보여야 하면 speed를 사용
    
        // Actual Device
        let setting = AVCapturePhotoSettings(format: [AVVideoCodecKey: AVVideoCodecType.jpeg])
        setting.photoQualityPrioritization = .balanced
        
        // 전면 카메라일 때 좌우반전 output 설정
        if let connection = output?.connection(with: .video) {
            connection.isVideoMirrored = !isBackCamera
        }
        output?.capturePhoto(with: setting, delegate: self)
        #endif
    }
    
    @objc func switchCameraInput(_ sender: NormalButton) {
        guard let session = session else { return }
        guard let backCameraInput = backCameraInput,
              let frontCameraInput = frontCameraInput else { return }
        
        sender.isUserInteractionEnabled = false
        session.beginConfiguration()
        
        if isBackCamera {
            // 전면 카메라로 전환
            session.removeInput(backCameraInput)
            session.addInput(frontCameraInput)
            isBackCamera = false
            layoutView.changeToFrontCamera()
        } else {
            // 후면 카메라로 전환
            session.removeInput(frontCameraInput)
            session.addInput(backCameraInput)
            isBackCamera = true
            layoutView.changeToBackCamera()
        }
        
        session.commitConfiguration()
        sender.isUserInteractionEnabled = true
    }
}

extension CaptureViewController: AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        // 카메라 세션 끊기, 끊지 않으면 여러번 사진 찍기 가능
        if let session = session, 
            session.isRunning {
            session.stopRunning()
        }
        
        guard let data = photo.fileDataRepresentation(),
              let image = UIImage(data: data) else { return }
        
        capturedPicture(image: image)
    }
}

// MARK: - Album
extension CaptureViewController: PHPickerViewControllerDelegate {
    @objc func showPHPicker() {
        var configuration = PHPickerConfiguration()
        configuration.selectionLimit = 1
        configuration.filter = .images
        
        let picker = PHPickerViewController(configuration: configuration)
        picker.delegate = self
        
        present(picker, animated: true)
    }
    
    func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        picker.dismiss(animated: true)
        
        guard let selectItem = results.first else { return }
        
        let itemProvider = selectItem.itemProvider
        
        guard itemProvider.canLoadObject(ofClass: UIImage.self) else { return }
        
        itemProvider.loadObject(ofClass: UIImage.self) { [weak self] image, error in
            guard let self else { return }
            
            DispatchQueue.main.async {
                guard let image = image as? UIImage else { return }
                self.capturedPicture(image: image)
            }
        }
    }
}
