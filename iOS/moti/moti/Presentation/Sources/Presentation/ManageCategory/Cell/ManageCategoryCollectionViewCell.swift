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
    private(set) var deleteCategoryButton = {
        let button = UIButton(type: .system)
        button.setImage(.init(systemName: "minus.circle"), for: .normal)
        button.tintColor = .red
        return button
    }()
    
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
    
    private let reorderButton = {
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
        
        setupDeleteCategoryButton()
        setupReorderButton()
        setupStackView()
    }
    
    func setupDeleteCategoryButton() {
        addSubview(deleteCategoryButton)
        deleteCategoryButton.atl
            .size(width: 44, height: 44)
            .centerY(equalTo: contentView.safeAreaLayoutGuide.centerYAnchor)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 10)
    }
    
    func setupStackView() {
        labelStackView.addArrangedSubview(categoryNameLabel)
        labelStackView.addArrangedSubview(categoryInfoLabel)
        
        addSubview(labelStackView)
        labelStackView.atl
            .centerY(equalTo: deleteCategoryButton.centerYAnchor)
            .left(equalTo: deleteCategoryButton.rightAnchor, constant: 10)
            .right(equalTo: reorderButton.leftAnchor, constant: -10)
    }
    
    func setupReorderButton() {
        addSubview(reorderButton)
        reorderButton.atl
            .size(width: 44, height: 44)
            .centerY(equalTo: contentView.safeAreaLayoutGuide.centerYAnchor)
            .right(equalTo: safeAreaLayoutGuide.rightAnchor, constant: -10)
    }
}
