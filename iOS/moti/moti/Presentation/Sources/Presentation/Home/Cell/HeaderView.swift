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
        label.font = .large
        return label
    }()
    
    private var countLabel: UILabel = {
        let label = UILabel()
        label.font = .xlargeBold
        return label
    }()
    
    private var titleLabel: UILabel = {
        let label = UILabel()
        label.text = "달성"
        label.font = .xlarge
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
        setupCategoryLabel()
        setupCountLabel()
        setupTitleLabel()
        setupDateLabel()
    }
    
    private func setupCategoryLabel() {
        addSubview(categoryLabel)
        categoryLabel.atl
            .top(equalTo: self.safeAreaLayoutGuide.topAnchor, constant: 7)
            .left(equalTo: self.safeAreaLayoutGuide.leftAnchor, constant: 10)
    }
    
    private func setupCountLabel() {
        addSubview(countLabel)
        countLabel.atl
            .top(equalTo: categoryLabel.bottomAnchor, constant: 5)
            .left(equalTo: categoryLabel.leftAnchor)
    }
    
    private func setupTitleLabel() {
        addSubview(titleLabel)
        titleLabel.atl
            .top(equalTo: countLabel.topAnchor)
            .left(equalTo: countLabel.rightAnchor, constant: 5)
    }
    
    private func setupDateLabel() {
        addSubview(dateLabel)
        dateLabel.atl
            .bottom(equalTo: titleLabel.bottomAnchor)
            .right(equalTo: self.safeAreaLayoutGuide.rightAnchor, constant: -10)
    }
    
    // MARK: - Method
    func configure(category: String, count: String, date: String) {
        categoryLabel.text = category
        countLabel.text = count
        dateLabel.text = "최근 달성일\n" + date
    }
    
    func showSkeleton() {
        titleLabel.backgroundColor = .lightGray
        dateLabel.backgroundColor = .lightGray
    }
}
