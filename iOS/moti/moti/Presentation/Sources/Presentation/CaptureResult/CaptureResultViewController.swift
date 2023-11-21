////
////  CaptureResultViewController.swift
////  
////
////  Created by 유정주 on 11/20/23.
////
//
//import UIKit
//import Core
//import Design
//
//final class CaptureResultViewController: BaseViewController<CaptureResultView> {
//    // MARK: - Properties
//    weak var coordinator: CaptureResultCoordinator?
//    
//    // TODO: ViewModel로 변환
//    private let resultImageData: Data
//    private let categories: [String] = ["카테고리1", "카테고리2", "카테고리3", "카테고리4", "카테고리5"]
//    private var bottomSheet = InputTextViewController()
//    
//    // MARK: - Init
//    init(resultImageData: Data) {
//        self.resultImageData = resultImageData
//        super.init(nibName: nil, bundle: nil)
//    }
//    
//    required init?(coder: NSCoder) {
//        fatalError("init(coder:) has not been implemented")
//    }
//    
//    // MARK: - Life Cycles
//    override func viewDidLoad() {
//        super.viewDidLoad()
//        setupPickerView()
//        addTarget()
//        
//        if let resultImage = convertDataToImage(resultImageData) {
//            layoutView.configure(image: resultImage, count: 10)
//        } else {
//            layoutView.configure(image: MotiImage.sample1, count: 10)
//        }
//    }
//    
//    override func viewIsAppearing(_ animated: Bool) {
//        super.viewIsAppearing(animated)
//        
//        showBottomSheet()
//    }
//    
//    override func viewWillDisappear(_ animated: Bool) {
//        super.viewWillDisappear(animated)
//        bottomSheet.dismiss(animated: true)
//    }
//    
//    private func setupPickerView() {
//        layoutView.categoryPickerView.delegate = self
//        layoutView.categoryPickerView.dataSource = self
//    }
//    
//    private func addTarget() {
//        layoutView.categoryButton.addTarget(self, action: #selector(showPicker), for: .touchUpInside)
//        layoutView.selectDoneButton.addTarget(self, action: #selector(donePicker), for: .touchUpInside)
//    }
//    
//    @objc private func showPicker() {
//        hideBottomSheet()
//        layoutView.showCategoryPicker()
//    }
//    
//    @objc private func donePicker() {
//        layoutView.hideCategoryPicker()
//        showBottomSheet()
//    }
//    
//    private func showBottomSheet() {
//        bottomSheet.modalPresentationStyle = .pageSheet
//        
//        if let sheet = bottomSheet.sheetPresentationController {
//            sheet.detents = [.small(), .large()]
//            sheet.prefersGrabberVisible = true
//            sheet.prefersScrollingExpandsWhenScrolledToEdge = false
//            sheet.selectedDetentIdentifier = .small
//            sheet.largestUndimmedDetentIdentifier = .large
//        }
//        
//        bottomSheet.isModalInPresentation = true
//        present(bottomSheet, animated: true)
//    }
//    
//    private func hideBottomSheet() {
//        bottomSheet.dismiss(animated: true)
//    }
//    
//
//}
//
//extension CaptureResultViewController: UIPickerViewDelegate {
//    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
//        layoutView.update(category: categories[row])
//    }
//}
//
//extension CaptureResultViewController: UIPickerViewDataSource {
//    func numberOfComponents(in pickerView: UIPickerView) -> Int {
//        return 1
//    }
//    
//    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
//        return categories.count
//    }
//    
//    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
//        return categories[row]
//    }
//}
