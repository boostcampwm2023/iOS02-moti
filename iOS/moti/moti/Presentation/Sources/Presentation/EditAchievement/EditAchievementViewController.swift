//
//  EditAchievementViewController.swift
//
//
//  Created by 유정주 on 11/23/23.
//

import UIKit
import Core
import Design
import Combine

final class EditAchievementViewController: BaseViewController<EditAchievementView> {
    
    // MARK: - Properties
    weak var coordinator: EditAchievementCoordinator?
    private let viewModel: EditAchievementViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    private let image: UIImage
    private var bottomSheet = TextViewBottomSheet()
    
    // MARK: - Init
    init(
        viewModel: EditAchievementViewModel,
        image: UIImage
    ) {
        self.viewModel = viewModel
        self.image = image
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        
        viewModel.action(.fetchCategories)
        addTarget()
        bind()
        
        layoutView.categoryPickerView.delegate = self
        layoutView.categoryPickerView.dataSource = self
        
        layoutView.configure(image: image)
        showBottomSheet()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        hideBottomSheet()
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        view.endEditing(true)
    }
    
    private func bind() {
        viewModel.$categoryState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                switch state {
                case .none, .loading: break
                case .finish:
                    self?.layoutView.categoryPickerView.reloadAllComponents()
                }
            }
            .store(in: &cancellables)
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
        layoutView.update(category: viewModel.findCategory(at: row).name)
    }
}

extension EditAchievementViewController: UIPickerViewDataSource {
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }

    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return viewModel.categories.count
    }

    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return viewModel.findCategory(at: row).name
    }
}
