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
import Domain

protocol EditAchievementViewControllerDelegate: AnyObject {
    func doneButtonDidClickedFromDetailView(updatedAchievement: Achievement)
    func doneButtonDidClickedFromCaptureView(newAchievement: Achievement)
}

final class EditAchievementViewController: BaseViewController<EditAchievementView> {
    
    // MARK: - Properties
    weak var coordinator: EditAchievementCoordinator?
    weak var delegate: EditAchievementViewControllerDelegate?
    private let viewModel: EditAchievementViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    private var bottomSheet: TextViewBottomSheet
    
    private var achievement: Achievement?
    
    // MARK: - Init
    init(
        viewModel: EditAchievementViewModel,
        image: UIImage
    ) {
        self.viewModel = viewModel
        self.bottomSheet = TextViewBottomSheet()
        super.init(nibName: nil, bundle: nil)
        
        layoutView.configure(image: image)
        if let imageData = image.jpegData(compressionQuality: 1.0) {
            viewModel.action(.saveImage(data: imageData))
        }
    }
    
    init(
        viewModel: EditAchievementViewModel,
        achievement: Achievement
    ) {
        self.viewModel = viewModel
        self.achievement = achievement
        self.bottomSheet = TextViewBottomSheet(text: achievement.body)
        super.init(nibName: nil, bundle: nil)
        
        layoutView.configure(achievement: achievement)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            title: "완료",
            style: .done,
            target: self,
            action: #selector(doneButtonDidClicked)
        )
        
        viewModel.action(.fetchCategories)
        addTarget()
        bind()
        
        layoutView.categoryPickerView.delegate = self
        layoutView.categoryPickerView.dataSource = self
    }
    
    override func viewIsAppearing(_ animated: Bool) {
        super.viewIsAppearing(animated)
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
                guard let self else { return }
                switch state {
                case .none, .loading: break
                case .finish:
                    layoutView.categoryPickerView.reloadAllComponents()
                    
                    if let achievement = achievement,
                       let category = achievement.category,
                       let index = viewModel.findCategoryIndex(category) {
                        layoutView.selectCategory(row: index, inComponent: 0)
                    } else if let firstCategory = viewModel.firstCategory {
                        layoutView.update(category: firstCategory.name)
                    }
                }
            }
            .store(in: &cancellables)
        
        viewModel.$saveImageState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] state in
                guard let self else { return }
                
                switch state {
                case .none:
                    break
                case .loading:
                    // 완료 버튼 비활성화
                    if let doneButton = navigationItem.rightBarButtonItem {
                        doneButton.isEnabled = false
                        navigationItem.rightBarButtonItem?.title = "로딩 중"
                    }
                case .finish:
                    // 완료 버튼 활성화
                    if let doneButton = navigationItem.rightBarButtonItem {
                        doneButton.isEnabled = true
                        navigationItem.rightBarButtonItem?.title = "완료"
                    }
                case .error:
                    // TODO: Alert 띄우고, 다시 업로드 진행하기
                    Logger.error("Upload Error")
                }
            }
            .store(in: &cancellables)
        
        viewModel.$updateAchievementState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none, .loading: break
                case .finish(let updatedAchievement):
                    hideBottomSheet()
                    delegate?.doneButtonDidClickedFromDetailView(updatedAchievement: updatedAchievement)
                case .error:
                    Logger.error("Achievement Update Error")
                }
            }
            .store(in: &cancellables)
        
        viewModel.$postAchievementState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none, .loading: break
                case .finish(let newAchievement):
                    hideBottomSheet()
                    delegate?.doneButtonDidClickedFromCaptureView(newAchievement: newAchievement)
                case .error:
                    Logger.error("Achievement Post Error")
                }
            }
            .store(in: &cancellables)

    }
    
    private func addTarget() {
        layoutView.categoryButton.addTarget(self, action: #selector(showPicker), for: .touchUpInside)
        layoutView.selectDoneButton.addTarget(self, action: #selector(donePicker), for: .touchUpInside)
    }
    
    @objc func doneButtonDidClicked() {
        // 카테고리
        guard let category = findSelectedCategory() else {
            hideBottomSheet()
            showErrorAlert(message: "카테고리를 선택하세요.", okAction: {
                self.showBottomSheet()
            })
            return
        }
        
        // 제목
        let title: String
        if let text = layoutView.titleTextField.text, !text.isEmpty {
            title = text
        } else {
            guard let placeholder = layoutView.titleTextField.placeholder else { return }
            title = placeholder
        }
        
        if let achievement = achievement { // 상세 화면에서 넘어옴 => 수정 API
            let updatedData = UpdateAchievementRequestBody(
                title: title,
                content: bottomSheet.text,
                categoryId: category.id
            )
            viewModel.action(.updateAchievement(achievement: achievement, updateData: updatedData))
        } else { // 촬영 화면에서 넘어옴 => 생성 API
            
            viewModel.action(.postAchievement(
                title: title,
                content: bottomSheet.text,
                categoryId: category.id)
            )
        }
    }
    
    private func findSelectedCategory() -> CategoryItem? {
        let selectedRow = layoutView.categoryPickerView.selectedRow(inComponent: 0)
        return viewModel.findCategory(at: selectedRow)
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
        guard let category = viewModel.findCategory(at: row) else { return }
        layoutView.update(category: category.name)
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
        guard let category = viewModel.findCategory(at: row) else { return nil }
        return category.name
    }
}
