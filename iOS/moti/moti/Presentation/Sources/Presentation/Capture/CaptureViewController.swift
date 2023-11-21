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
    private var bottomSheet = TextViewBottomSheet()

    // Capture Session
    private var session: AVCaptureSession?
    
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
    }
        
    func startCapture() {
        layoutView.achievementView.hideCategoryPicker()
        hideBottomSheet()
        setupCamera()
        layoutView.changeToCaptureMode()
    }
    
    func startEdit(image: UIImage) {
        showBottomSheet()
        layoutView.changeToEditMode(image: MotiImage.sample1)
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
        } catch {
            Logger.debug(error)
        }
            
        output = AVCapturePhotoOutput()
        if let output = output,
            session.canAddOutput(output) {
            session.addOutput(output)
            Logger.debug("Add AVCapturePhotoOutput")
        }

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
        self.session = session
    }

    @objc private func didClickedShutterButton() {
        
        // 사진 찍기!
        #if targetEnvironment(simulator)
        // Simulator
        Logger.debug("시뮬레이터에선 카메라를 테스트할 수 없습니다. 실기기를 연결해 주세요.")
        delegate?.didCapture()
        startEdit(image: MotiImage.sample1)
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
        if let session = session, 
            session.isRunning {
            session.stopRunning()
        }
        
        guard let data = photo.fileDataRepresentation() else { return }
        
        if let image = convertDataToImage(data) {
            delegate?.didCapture()
            let rect = CGRect(origin: .zero, size: .init(width: 1000, height: 1000))
            let croppedImage = cropImage(image: image, rect: rect)
            layoutView.changeToEditMode(image: croppedImage)
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
