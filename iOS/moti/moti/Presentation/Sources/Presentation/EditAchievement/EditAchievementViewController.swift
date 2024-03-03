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
    
    private var achievement: Achievement?
    private let currentCategoryId: Int?
    
    // MARK: - Views
    private var bottomSheet: TextViewBottomSheet
    private lazy var doneButton = {
        let barButton = UIBarButtonItem(
            title: "완료",
            style: .done,
            target: self,
            action: #selector(doneButtonDidClicked)
        )
        return barButton
    }()
    private lazy var uploadButton = {
        let barButton = UIBarButtonItem(
            title: "업로드",
            style: .done,
            target: self,
            action: #selector(uploadButtonDidClicked)
        )
        return barButton
    }()
    
    // MARK: - Init
    init(
        viewModel: EditAchievementViewModel,
        image: UIImage,
        currentCategoryId: Int?
    ) {
        self.viewModel = viewModel
        self.bottomSheet = TextViewBottomSheet()
        self.currentCategoryId = currentCategoryId
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
        self.currentCategoryId = nil
        super.init(nibName: nil, bundle: nil)
        
        layoutView.configure(achievement: achievement)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNavigationBar()
        
        addTarget()
        bind()
        
        layoutView.categoryPickerView.delegate = self
        layoutView.categoryPickerView.dataSource = self
        
        viewModel.action(.fetchCategories)
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
    
    private func addTarget() {
        layoutView.titleTextField.delegate  = self
        layoutView.categoryButton.addTarget(self, action: #selector(showPicker), for: .touchUpInside)
        layoutView.selectDoneButton.addTarget(self, action: #selector(donePicker), for: .touchUpInside)
    }
}

extension EditAchievementViewController: UITextFieldDelegate {

    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        guard let text = textField.text else { return true }
        let newLength = text.count + string.count - range.length
        return newLength <= 21 // 한글 종성때문에 20 + 1로 설정
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

    func hideBottomSheet(completion: (() -> Void)? = nil) {
        bottomSheet.dismiss(animated: true, completion: completion)
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

// MARK: - Navigationbar
private extension EditAchievementViewController {

    func setupNavigationBar() {
        navigationItem.rightBarButtonItems = [doneButton]
    }
    
    func showDoneButton() {
        navigationItem.rightBarButtonItems = [doneButton]
        uploadButton.isEnabled = false
        doneButton.isEnabled = true
    }
    
    func showUploadButton() {
        navigationItem.rightBarButtonItems = [doneButton, uploadButton]
        uploadButton.isEnabled = true
        doneButton.title = "실패"
        doneButton.isEnabled = false
    }
    
    @objc func uploadButtonDidClicked() {
        navigationItem.rightBarButtonItems = [doneButton]
        doneButton.isEnabled = false
        viewModel.action(.retrySaveImage)
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
        
        // 본문
        let body = bottomSheet.text
        
        if let achievement = achievement { // 상세 화면에서 넘어옴 => 수정 API
            var updatedAchievement = achievement
            updatedAchievement.title = title
            updatedAchievement.body = body
            updatedAchievement.category = category
            
            viewModel.action(.updateAchievement(updatedAchievement: updatedAchievement))
        } else { // 촬영 화면에서 넘어옴 => 생성 API
            viewModel.action(.postAchievement(
                title: title,
                content: body,
                categoryId: category.id)
            )
        }
    }
    
    private func findSelectedCategory() -> CategoryItem? {
        let selectedRow = layoutView.categoryPickerView.selectedRow(inComponent: 0)
        return viewModel.findCategory(at: selectedRow)
    }
}

// MARK: - Binding
private extension EditAchievementViewController {

    func bind() {
        bindAchievement()
        
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
                    } else if let currentCategoryId,
                              let (index, currentCategory) = viewModel.findCategoryItem(categoryId: currentCategoryId) {
                        layoutView.update(category: currentCategory.name)
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
                case .none: break
                case .loading:
                    doneButton.isEnabled = false
                    doneButton.title = "로딩 중"
                case .finish:
                    // 완료 버튼 활성화
                    doneButton.isEnabled = true
                    doneButton.title = "완료"
                case .error:
                    Logger.error("사진 업로드 에러")
                    doneButton.isEnabled = false
                    doneButton.title = "실패"
                    
                    // Bottom Sheet이 띄워져 있으면 Alert이 안 나옴
                    hideBottomSheet(completion: {
                        self.showTwoButtonAlert(
                            title: "사진 업로드 실패",
                            message: "네트워크가 불안정하여 사진 업로드를 실패했습니다. 다시 시도해 주세요.",
                            okTitle: "다시 시도",
                            okAction: {
                                // OK 버튼 누르면 재시도 하는 시나리오
                                self.showBottomSheet()
                                self.uploadButtonDidClicked()
                            }, cancelAction: {
                                // 사용자가 직접 업로드 버튼을 누르는 시나리오
                                self.showBottomSheet()
                                self.showUploadButton()
                            }
                        )
                    })
                }
            }
            .store(in: &cancellables)
    }
    
    func bindAchievement() {
        viewModel.$updateAchievementState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none: break
                case .loading:
                    hideBottomSheet()
                case .finish(let updatedAchievement):
                    delegate?.doneButtonDidClickedFromDetailView(updatedAchievement: updatedAchievement)
                case .error:
                    showBottomSheet()
                    Logger.error("Achievement Update Error")
                }
            }
            .store(in: &cancellables)
        
        viewModel.$postAchievementState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .none: break
                case .loading:
                    hideBottomSheet()
                case .finish(let newAchievement):
                    delegate?.doneButtonDidClickedFromCaptureView(newAchievement: newAchievement)
                case .error:
                    showBottomSheet()
                    Logger.error("Achievement Post Error")
                }
            }
            .store(in: &cancellables)
    }
}
