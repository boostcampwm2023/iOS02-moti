//
//  HeaderView.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit

final class HeaderView: UICollectionViewCell {
    
    // MARK: - View
    private var categoryLabel: UILabel = {
        let label = UILabel()
        label.font = .medium
        return label
    }()
    
    private var titleLabel: UILabel = {
        let label = UILabel()
        label.font = .big
        return label
    }()
    
    private var dateLabel: UILabel = {
        let label = UILabel()
        label.numberOfLines = 2
        label.font = .small
        return label
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
    
    // MARK: - Setup
    private func setupUI() {
        self.layer.borderColor = UIColor.red.cgColor
        self.layer.borderWidth = 1
        setupCategoryLabel()
        setupTitleLabel()
        setupDateLabel()
    }
    
    private func setupCategoryLabel() {
        addSubview(categoryLabel)
        categoryLabel.atl
            .top(equalTo: self.safeAreaLayoutGuide.topAnchor)
            .left(equalTo: self.safeAreaLayoutGuide.leftAnchor, constant: 10)
    }
    
    private func setupTitleLabel() {
        addSubview(titleLabel)
        titleLabel.atl
            .top(equalTo: categoryLabel.bottomAnchor, constant: 5)
            .left(equalTo: categoryLabel.leftAnchor)
    }
    
    private func setupDateLabel() {
        addSubview(dateLabel)
        dateLabel.atl
            .bottom(equalTo: titleLabel.bottomAnchor)
            .right(equalTo: self.safeAreaLayoutGuide.rightAnchor, constant: -10)
    }
    
    // MARK: - Method
    func configure(category: String, title: String, date: String) {
        categoryLabel.text = category
        titleLabel.text = title
        dateLabel.text = "최근 달성일\n" + date
    }
    
    func showSkeleton() {
        titleLabel.backgroundColor = .lightGray
        dateLabel.backgroundColor = .lightGray
    }
}
