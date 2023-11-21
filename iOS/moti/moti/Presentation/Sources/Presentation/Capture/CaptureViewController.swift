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

protocol CaptureViewControllerDelegate: AnyObject {
    func didCapture()
}

final class CaptureViewController: BaseViewController<CaptureView> {
    
    // MARK: - Properties
    weak var delegate: CaptureViewControllerDelegate?
    weak var coordinator: CaptureCoordinator?
    
    private let categories: [String] = ["카테고리1", "카테고리2", "카테고리3", "카테고리4", "카테고리5"]
    private var bottomSheet = TextViewBottomSheet()

    // Capture Session
    private var isBackCamera = true
    private var session: AVCaptureSession?
    private var backCameraInput: AVCaptureDeviceInput?
    private var frontCameraInput: AVCaptureDeviceInput?
    
    // Photo Output
    private var output: AVCapturePhotoOutput?
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupCategoryPickerView()
        addTargets()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        checkCameraPermissions()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        if let session = session, 
            session.isRunning {
            Logger.debug("Session Stop Running")
            session.stopRunning()
        }
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        view.endEditing(true)
    }
    
    // MARK: - Methods
    private func addTargets() {
        layoutView.captureButton.addTarget(self, action: #selector(didClickedShutterButton), for: .touchUpInside)
        layoutView.achievementView.categoryButton.addTarget(self, action: #selector(showPicker), for: .touchUpInside)
        layoutView.achievementView.selectDoneButton.addTarget(self, action: #selector(donePicker), for: .touchUpInside)
        layoutView.albumButton.addTarget(self, action: #selector(showPHPicker), for: .touchUpInside)
        layoutView.cameraSwitchingButton.addTarget(self, action: #selector(switchCameraInput), for: .touchUpInside)
    }
        
    func startCapture() {
        layoutView.achievementView.hideCategoryPicker()
        hideBottomSheet()
        setupCamera()
        layoutView.changeToCaptureMode()
    }
    
    func startEdit(image: UIImage) {
        showBottomSheet()
        layoutView.changeToEditMode(image: image)
    }
    
    private func capturedPicture(image: UIImage) {
        guard let croppedImage = image.cropToSquare() else { return }
        startEdit(image: croppedImage)

        delegate?.didCapture()
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
        // 세션을 만들고 input, output 연결
        let session = AVCaptureSession()
        session.beginConfiguration()
        
        if session.canSetSessionPreset(.photo) {
            session.sessionPreset = .photo
        }

        setupBackCamera(session: session)
        setupFrontCamera(session: session)
        
        if isBackCamera,
           let backCameraInput = backCameraInput {
            session.addInput(backCameraInput)
        } else if let frontCameraInput = frontCameraInput {
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

        layoutView.updatePreviewLayer(session: session)
        layoutView.changeToCaptureMode()
        
        DispatchQueue.global().async {
            if !session.isRunning {
                Logger.debug("Session Start Running")
                session.startRunning()
            } else {
                Logger.debug("Session Already Running")
            }
        }
    }
    
    // 후면 카메라 설정
    private func setupBackCamera(session: AVCaptureSession) {
        if let backCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back),
           let backCameraInput = try? AVCaptureDeviceInput(device: backCamera) {
            if session.canAddInput(backCameraInput) {
                Logger.debug("Add Back Camera Input")
                self.backCameraInput = backCameraInput
            }
        } else {
            Logger.error("후면 카메라를 추가할 수 없음")
        }
    }
    
    // 전면 카메라 설정
    private func setupFrontCamera(session: AVCaptureSession) {
        if let frontCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front),
           let frontCameraInput = try? AVCaptureDeviceInput(device: frontCamera) {
            if session.canAddInput(frontCameraInput) {
                Logger.debug("Add Front Camera Input")
                self.frontCameraInput = frontCameraInput
            }
        } else {
            Logger.error("전면 카메라를 추가할 수 없음")
        }
    }

    @objc private func didClickedShutterButton() {
        
        // 사진 찍기!
        #if targetEnvironment(simulator)
        // Simulator
        Logger.debug("시뮬레이터에선 카메라를 테스트할 수 없습니다. 실기기를 연결해 주세요.")
        capturedPicture(image: MotiImage.sample1)
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
        
        // 전면 카메라일 때 좌우반전 output 설정
        if let connection = output?.connection(with: .video) {
            print("isBackCamera: \(isBackCamera)")
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
        } else {
            // 후면 카메라로 전환
            session.removeInput(frontCameraInput)
            session.addInput(backCameraInput)
            isBackCamera = true
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

// MARK: - Bottom Sheet
private extension CaptureViewController {
    func showBottomSheet() {
        bottomSheet.modalPresentationStyle = .pageSheet

        if let sheet = bottomSheet.sheetPresentationController {
            sheet.detents = [.small(), .large()]
            sheet.prefersGrabberVisible = true
            sheet.prefersScrollingExpandsWhenScrolledToEdge = false
            sheet.selectedDetentIdentifier = .small
            sheet.largestUndimmedDetentIdentifier = .large
        }

        bottomSheet.isModalInPresentation = true
        present(bottomSheet, animated: true)
    }

    func hideBottomSheet() {
        bottomSheet.dismiss(animated: true)
    }
}

// MARK: - Category PickerView
extension CaptureViewController {
    private func setupCategoryPickerView() {
        layoutView.achievementView.categoryPickerView.delegate = self
        layoutView.achievementView.categoryPickerView.dataSource = self
    }
    
    @objc private func showPicker() {
        hideBottomSheet()
        layoutView.achievementView.showCategoryPicker()
    }

    @objc private func donePicker() {
        layoutView.achievementView.hideCategoryPicker()
        showBottomSheet()
    }
}

extension CaptureViewController: UIPickerViewDelegate {
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        layoutView.achievementView.update(category: categories[row])
    }
}

extension CaptureViewController: UIPickerViewDataSource {
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }

    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return categories.count
    }

    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return categories[row]
    }
}
