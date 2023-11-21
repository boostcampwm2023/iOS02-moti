//
//  AchievementView.swift
//  
//
//  Created by 유정주 on 11/21/23.
//

import UIKit

final class AchievementView: UIView {
    // MARK: - Views
    let resultImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.contentMode = .scaleAspectFill
        imageView.backgroundColor = .gray
        imageView.clipsToBounds = true
        return imageView
    }()
    
    private let titleTextField = {
        let textField = UITextField()
        textField.font = .largeBold
        textField.placeholder = "도전 성공"
        return textField
    }()
    
    let categoryButton = {
        let button = UIButton(type: .system)
        
        button.setTitle("카테고리", for: .normal)
        button.setTitleColor(.primaryDarkGray, for: .normal)
        button.setTitleColor(.label, for: .disabled)
        
        return button
    }()
    
    let categoryPickerView = {
        let pickerView = UIPickerView()
        pickerView.backgroundColor = .primaryGray
        pickerView.isHidden = true
        return pickerView
    }()
    
    let selectDoneButton = {
        let button = UIButton(type: .system)
        button.setTitle("완료", for: .normal)
        button.isHidden = true
        return button
    }()
    
    // MARK: - Init
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    func configureEdit(image: UIImage, category: String? = nil) {
        resultImageView.image = image
        
        if let category {
            titleTextField.placeholder = "\(category) 도전 성공"
            categoryButton.setTitle(category, for: .normal)
        }
    }
    
    func configureReadOnly(image: UIImage, title: String, category: String) {
        resultImageView.image = image
        
        titleTextField.text = title
        titleTextField.isEnabled = false
        
        categoryButton.setTitle(category, for: .normal)
        categoryButton.isEnabled = false
    }
    
    func update(image: UIImage) {
        resultImageView.image = image
    }
    
    func update(title: String) {
        titleTextField.text = title
    }
    
    func update(category: String) {
        categoryButton.setTitle(category, for: .normal)
        categoryButton.setTitleColor(.label, for: .normal)
    }
    
    func editMode() {
        titleTextField.isEnabled = true
        categoryButton.isEnabled = true
    }
    
    func readOnlyMode() {
        titleTextField.isEnabled = false
        categoryButton.isEnabled = false
    }
    
    func showCategoryPicker() {
        categoryPickerView.isHidden = false
        selectDoneButton.isHidden = false
    }
    
    func hideCategoryPicker() {
        categoryPickerView.isHidden = true
        selectDoneButton.isHidden = true
    }
}

// MARK: - Setup
extension AchievementView {
    private func setupUI() {
        setupCategoryButton()
        setupTitleTextField()
        setupResultImageView()
        setupCategoryPickerView()
    }
    
    private func setupCategoryButton() {
        addSubview(categoryButton)
        categoryButton.atl
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
            .top(equalTo: safeAreaLayoutGuide.topAnchor, constant: 20)
    }

    private func setupTitleTextField() {
        addSubview(titleTextField)
        titleTextField.atl
            .horizontal(equalTo: safeAreaLayoutGuide, constant: 20)
            .top(equalTo: categoryButton.bottomAnchor)
    }
    
    private func setupResultImageView() {
        addSubview(resultImageView)
        resultImageView.atl
            .horizontal(equalTo: safeAreaLayoutGuide)
            .height(equalTo: resultImageView.widthAnchor)
            .top(equalTo: titleTextField.bottomAnchor, constant: 10)
    }
        
    private func setupCategoryPickerView() {
        addSubview(categoryPickerView)
        addSubview(selectDoneButton)
        
        categoryPickerView.atl
            .horizontal(equalTo: safeAreaLayoutGuide)
            .bottom(equalTo: bottomAnchor)
        
        selectDoneButton.atl
            .right(equalTo: categoryPickerView.rightAnchor, constant: -10)
            .top(equalTo: categoryPickerView.topAnchor, constant: 10)
    }
}
