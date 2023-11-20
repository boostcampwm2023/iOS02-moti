//
//  CaptureResultView.swift
//  
//
//  Created by 유정주 on 11/20/23.
//

import UIKit
import Design
import Domain

final class CaptureResultView: UIView {

    // MARK: - Views
    private let resultImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.contentMode = .scaleAspectFill
        imageView.backgroundColor = .gray
        return imageView
    }()
    
    private let titleTextField = {
        let textField = UITextField()
        textField.font = .largeBold
        return textField
    }()
    
    let categoryButton = {
        let button = UIButton(type: .system)
        
        button.setTitle("카테고리", for: .normal)
        button.setTitleColor(.primaryDarkGray, for: .normal)
        
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
    
    func configure(image: UIImage, category: String? = nil, count: Int) {
        resultImageView.image = image
        
        if let category {
            titleTextField.placeholder = "\(category) \(count)회 성공"
            categoryButton.setTitle(category, for: .normal)
        } else {
            titleTextField.placeholder = "\(count)회 성공"
        }
    }
    
    func update(category: String) {
        categoryButton.setTitle(category, for: .normal)
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
extension CaptureResultView {
    private func setupUI() {
        setupResultImageView()
        setupTitleTextField()
        setupCategoryButton()
        setupCategoryPickerView()
    }
    
    private func setupResultImageView() {
        addSubview(resultImageView)
        resultImageView.atl
            .height(equalTo: resultImageView.widthAnchor)
            .top(equalTo: safeAreaLayoutGuide.topAnchor, constant: 100)
            .horizontal(equalTo: safeAreaLayoutGuide)
    }
    
    private func setupTitleTextField() {
        addSubview(titleTextField)
        titleTextField.atl
            .horizontal(equalTo: safeAreaLayoutGuide, constant: 20)
            .bottom(equalTo: resultImageView.topAnchor, constant: -20)
    }
    
    private func setupCategoryButton() {
        addSubview(categoryButton)
        categoryButton.atl
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
            .bottom(equalTo: titleTextField.topAnchor, constant: -5)
    }
    
    private func setupCategoryPickerView() {
        addSubview(categoryPickerView)
        addSubview(selectDoneButton)
        categoryPickerView.atl
            .height(constant: 150)
            .horizontal(equalTo: safeAreaLayoutGuide)
            .bottom(equalTo: safeAreaLayoutGuide.bottomAnchor)
        
        selectDoneButton.atl
            .right(equalTo: categoryPickerView.rightAnchor, constant: -10)
            .top(equalTo: categoryPickerView.topAnchor, constant: 10)
    }
}
