//
//  HeaderView.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit

final class HeaderView: UICollectionReusableView {
    
    // MARK: - View
    private var titleLabel: UILabel = {
        let label = UILabel()
        label.numberOfLines = 2
        label.text = "다이어트\n32회 달성"
        return label
    }()
    
    private var dateLabel: UILabel = {
        let label = UILabel()
        label.numberOfLines = 2
        label.text = "최근 달성일\n2023-11-03"
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
        setupTitleLabel()
        setupDateLabel()
    }
    
    private func setupTitleLabel() {
        addSubview(titleLabel)
        titleLabel.atl
            .top(equalTo: self.topAnchor, constant: 10)
            .left(equalTo: self.leftAnchor, constant: 10)
    }
    
    private func setupDateLabel() {
        addSubview(dateLabel)
        dateLabel.atl
            .top(equalTo: self.topAnchor, constant: 30)
            .right(equalTo: self.rightAnchor, constant: -20)
    }
    
    // MARK: - Method
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

