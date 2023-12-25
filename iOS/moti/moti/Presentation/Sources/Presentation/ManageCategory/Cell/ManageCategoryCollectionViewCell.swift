//
//  ManageCategoryCollectionViewCell.swift
//  
//
//  Created by Kihyun Lee on 12/25/23.
//

import UIKit
import Domain
import Design

final class ManageCategoryCollectionViewCell: UICollectionViewCell {
    // MARK: - Views
    private var labelStackView = {
        let stackView = UIStackView()
        stackView.axis = .vertical
        stackView.spacing = 2
        stackView.distribution = .fillEqually
        return stackView
    }()
    
    private let categoryNameLabel = {
        let label = UILabel()
        label.font = .mediumBold
        label.numberOfLines = 1
        return label
    }()
    
    private let categoryInfoLabel = {
        let label = UILabel()
        label.font = .medium
        label.numberOfLines = 1
        return label
    }()
    
    private var accessoryButton = {
        let button = UIButton(type: .system)
        button.setImage(.init(systemName: "line.3.horizontal"), for: .normal)
        button.tintColor = .lightGray
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
    
    // MARK: - Methods
    func configure(with category: CategoryItem) {
        categoryNameLabel.text = category.name
        categoryInfoLabel.text = "총 \(category.continued)회 달성 | " + (category.lastChallenged?.relativeDateString() ?? "없음")
    }
}

// MARK: - Setup
private extension ManageCategoryCollectionViewCell {
    func setupUI() {
        self.layer.cornerRadius = CornerRadius.big
        self.layer.borderWidth = 1
        self.layer.borderColor = UIColor.primaryDarkGray.cgColor
        
        setupStackView()
        setupAccessoryButton()
    }
    
    func setupStackView() {
        labelStackView.addArrangedSubview(categoryNameLabel)
        labelStackView.addArrangedSubview(categoryInfoLabel)
        
        addSubview(labelStackView)
        labelStackView.atl
            .centerY(equalTo: contentView.safeAreaLayoutGuide.centerYAnchor)
            .left(equalTo: contentView.safeAreaLayoutGuide.leftAnchor, constant: 20)
    }
    
    func setupAccessoryButton() {
        addSubview(accessoryButton)
        accessoryButton.atl
            .centerY(equalTo: labelStackView.centerYAnchor)
            .right(equalTo: contentView.safeAreaLayoutGuide.rightAnchor, constant: -15)
    }
}
