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
        label.font = .systemFont(ofSize: 24)
        return label
    }()
    
    private var titleLabel: UILabel = {
        let label = UILabel()
        label.font = .systemFont(ofSize: 36)
        return label
    }()
    
    private var dateInfoLabel: UILabel = {
        let label = UILabel()
        label.text = "최근 달성일"
        label.font = .systemFont(ofSize: 12)
        return label
    }()
    
    private var dateLabel: UILabel = {
        let label = UILabel()
        label.font = .systemFont(ofSize: 12)
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
        setupCategoryLabel()
        setupTitleLabel()
        setupDateLabel()
        setupDateInfoLabel()
    }
    
    private func setupCategoryLabel() {
        addSubview(categoryLabel)
        categoryLabel.atl
            .top(equalTo: self.topAnchor, constant: 5)
            .left(equalTo: self.leftAnchor, constant: 10)
    }
    
    private func setupTitleLabel() {
        addSubview(titleLabel)
        titleLabel.atl
            .top(equalTo: categoryLabel.bottomAnchor, constant: 10)
            .left(equalTo: self.leftAnchor, constant: 10)
    }
    
    private func setupDateInfoLabel() {
        addSubview(dateInfoLabel)
        dateInfoLabel.atl
            .bottom(equalTo: dateLabel.topAnchor, constant: -10)
            .right(equalTo: self.rightAnchor, constant: -10)
    }
    
    private func setupDateLabel() {
        addSubview(dateLabel)
        dateLabel.atl
            .bottom(equalTo: titleLabel.bottomAnchor)
            .right(equalTo: self.rightAnchor, constant: -10)
    }
    
    // MARK: - Method
    func configure(category: String) {
        categoryLabel.text = category
    }
    
    func configure(title: String) {
        titleLabel.text = title
    }
    
    func configure(date: String) {
        dateLabel.text = date
    }
    
    func showSkeleton() {
        titleLabel.backgroundColor = .lightGray
        dateLabel.backgroundColor = .lightGray
    }
}

