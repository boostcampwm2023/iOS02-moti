//
//  GroupListCollectionViewCell.swift
//  
//
//  Created by 유정주 on 11/30/23.
//

import UIKit

final class GroupListCollectionViewCell: UICollectionViewCell {
    
    private let iconSize: CGFloat = 60
    
    private lazy var iconImageView = {
        let imageView = UIImageView()
        
        imageView.contentMode = .scaleAspectFill
        imageView.clipsToBounds = true
        imageView.layer.cornerRadius = iconSize / 2.0
        imageView.backgroundColor = .primaryGray
        
        return imageView
    }()
    
    private var labelStackView = {
        let stackView = UIStackView()
        stackView.axis = .vertical
        stackView.spacing = 10
        stackView.distribution = .fillEqually
        return stackView
    }()
    
    private let titleLabel = {
        let label = UILabel()
        label.font = .mediumBold
        label.numberOfLines = 1
        return label
    }()
    
    private let continuedLabel = {
        let label = UILabel()
        label.font = .mediumBold
        label.numberOfLines = 1
        return label
    }()
    
    private let lastChallengedLabel = {
        let label = UILabel()
        label.font = .mediumBold
        label.numberOfLines = 1
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
}

// MARK: - Setup
private extension GroupListCollectionViewCell {
    func setupUI() {
        setupIconImageView()
        setupStackView()
    }
    
    func setupIconImageView() {
        addSubview(iconImageView)
        iconImageView.atl
            .size(width: iconSize, height: iconSize)
            .centerY(equalTo: contentView.safeAreaLayoutGuide.centerYAnchor)
            .left(equalTo: contentView.safeAreaLayoutGuide.leftAnchor, constant: 20)
    }
    
    func setupStackView() {
        labelStackView.addArrangedSubview(titleLabel)
        labelStackView.addArrangedSubview(continuedLabel)
        labelStackView.addArrangedSubview(lastChallengedLabel)
        
        addSubview(labelStackView)
        labelStackView.atl
            .centerY(equalTo: iconImageView.centerYAnchor)
            .left(equalTo: iconImageView.rightAnchor, constant: 20)
    }
}
