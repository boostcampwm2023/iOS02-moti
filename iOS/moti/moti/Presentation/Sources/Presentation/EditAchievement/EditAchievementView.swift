//
//  EditAchievementView.swift
//
//
//  Created by 유정주 on 11/23/23.
//

import UIKit
import Design
import Domain
import Jeongfisher

final class EditAchievementView: UIView {
    // MARK: - Views
    private let resultImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.isAccessibilityElement = true
        imageView.contentMode = .scaleAspectFill
        imageView.backgroundColor = .gray
        imageView.clipsToBounds = true
        return imageView
    }()
    
    let titleTextField = {
        let textField = UITextField()
        textField.font = .largeBold
        textField.placeholder = "\(Date().convertStringMM월_dd일()) 도전"
        textField.returnKeyType = .done
        return textField
    }()
    
    let categoryButton = {
        let button = UIButton(type: .system)
        button.configuration = .plain()
        let config = UIImage.SymbolConfiguration(font: .small)
        let image = UIImage(systemName: "chevron.up.chevron.down", withConfiguration: config)
        button.setImage(image, for: .normal)
        button.tintColor = .label
        button.configuration?.imagePlacement = .trailing
        
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
        titleTextField.delegate = self
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    func configure(image: UIImage?, category: String? = nil) {
        resultImageView.image = image
        
        if let category {
            titleTextField.placeholder = "\(category) 도전 성공"
            update(category: category)
        }
    }
    
    func configure(achievement: Achievement) {
        resultImageView.accessibilityLabel = achievement.title
        if let url = achievement.imageURL {
            resultImageView.jk.setImage(with: url, imageType: .original)
        }
        
        titleTextField.text = achievement.title
        if let category = achievement.category?.name {
            update(category: category)
        }
    }
    
    func update(category: String) {
        categoryButton.setTitle(category, for: .normal)
        categoryButton.setTitleColor(.label, for: .normal)
    }
    
    func selectCategory(row: Int, inComponent: Int) {
        categoryPickerView.selectRow(row, inComponent: inComponent, animated: false)
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
extension EditAchievementView {
    private func setupUI() {
        setupResultImageView()
        setupTitleTextField()
        setupCategoryButton()
        setupCategoryPickerView()
    }
    
    private func setupCategoryButton() {
        addSubview(categoryButton)
        categoryButton.atl
            .top(greaterThanOrEqualTo: safeAreaLayoutGuide.topAnchor)
            .bottom(greaterThanOrEqualTo: titleTextField.topAnchor, constant: -5)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 10)
    }

    private func setupTitleTextField() {
        addSubview(titleTextField)
        titleTextField.atl
            .horizontal(equalTo: safeAreaLayoutGuide, constant: 20)
            .bottom(greaterThanOrEqualTo: resultImageView.topAnchor, constant: -10)
            .bottom(lessThanOrEqualTo: resultImageView.topAnchor, constant: 0)
    }
    
    private func setupResultImageView() {
        addSubview(resultImageView)
        resultImageView.atl
            .height(equalTo: resultImageView.widthAnchor)
            .centerX(equalTo: safeAreaLayoutGuide.centerXAnchor)
            .centerY(greaterThanOrEqualTo: centerYAnchor, constant: -20)
        
        let widthConstraint = resultImageView.widthAnchor.constraint(equalTo: safeAreaLayoutGuide.widthAnchor)
        widthConstraint.priority = .defaultHigh
        NSLayoutConstraint.activate([
            resultImageView.widthAnchor.constraint(lessThanOrEqualToConstant: 400),
            widthConstraint
        ])
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

// MARK: - UITextFieldDelegate
extension EditAchievementView: UITextFieldDelegate {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        return true
    }
}
