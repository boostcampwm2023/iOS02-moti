//
//  EditAchievementViewController.swift
//
//
//  Created by 유정주 on 11/23/23.
//

import UIKit
import Core
import Design

final class EditAchievementViewController: BaseViewController<EditAchievementView> {
    
    // MARK: - Properties
    weak var coordinator: EditAchievementCoordinator?
    private let image: UIImage
    
    private let categories: [String] = ["카테고리1", "카테고리2", "카테고리3", "카테고리4", "카테고리5"]
    private var bottomSheet = TextViewBottomSheet()
    
    // MARK: - Init
    init(image: UIImage) {
        self.image = image
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        
        layoutView.configure(image: image)
        showBottomSheet()
        addTarget()

        layoutView.categoryPickerView.delegate = self
        layoutView.categoryPickerView.dataSource = self
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        hideBottomSheet()
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        view.endEditing(true)
    }
    
    private func addTarget() {
        layoutView.categoryButton.addTarget(self, action: #selector(showPicker), for: .touchUpInside)
        layoutView.selectDoneButton.addTarget(self, action: #selector(donePicker), for: .touchUpInside)
    }
}

// MARK: - Bottom Sheet
private extension EditAchievementViewController {
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
extension EditAchievementViewController {
    private func setupCategoryPickerView() {
        layoutView.categoryPickerView.delegate = self
        layoutView.categoryPickerView.dataSource = self
    }
    
    @objc private func showPicker() {
        hideBottomSheet()
        layoutView.showCategoryPicker()
    }

    @objc private func donePicker() {
        layoutView.hideCategoryPicker()
        showBottomSheet()
    }
}

extension EditAchievementViewController: UIPickerViewDelegate {
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        layoutView.update(category: categories[row])
    }
}

extension EditAchievementViewController: UIPickerViewDataSource {
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
