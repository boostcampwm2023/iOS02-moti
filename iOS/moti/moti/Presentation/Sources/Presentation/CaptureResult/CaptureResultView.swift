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
    private let categoryButton = {
        let button = UIButton(type: .system)
        
        button.setTitle("카테고리", for: .normal)
        button.setTitleColor(.primaryDarkGray, for: .normal)
        
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
    
    private func setupUI() {
        setupResultImageView()
        setupTitleTextField()
        setupCategoryButton()
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
}

// MARK: - Setup
extension CaptureResultView {
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
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
            .bottom(equalTo: resultImageView.topAnchor, constant: -20)
    }
    
    private func setupCategoryButton() {
        addSubview(categoryButton)
        categoryButton.atl
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
            .bottom(equalTo: titleTextField.topAnchor, constant: -5)
    }
}
