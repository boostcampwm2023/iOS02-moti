//
//  GroupListCollectionViewCell.swift
//  
//
//  Created by 유정주 on 11/30/23.
//

import UIKit
import Domain
import Jeongfisher
import Design

final class GroupListCollectionViewCell: UICollectionViewCell {
    
    // MARK: - Properties
    private let iconSize: CGFloat = 60
    
    override var isHighlighted: Bool {
        didSet {
            if isHighlighted {
                bounceAnimation()
            } else {
                normalAnimation()
            }
        }
    }
    
    // MARK: - Views
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
        stackView.spacing = 2
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
        label.font = .medium
        label.numberOfLines = 1
        return label
    }()
    
    private let lastChallengedLabel = {
        let label = UILabel()
        label.font = .medium
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
    
    // MARK: - Methods
    func configure(with group: Group) {
        if let url = group.avatarUrl {
            iconImageView.jf.setImage(with: url)
        }
        titleLabel.text = group.name
        continuedLabel.text = "총 \(group.continued)회 달성"
        lastChallengedLabel.text = group.lastChallenged?.convertStringYYYY년_MM월_dd일() ?? "없음"
    }
    
    func showSkeleton() {
        
    }
    
    func hideSkeleton() {
        
    }
    
    func cancelDownloadImage() {
        iconImageView.jf.cancelDownloadImage()
    }
}

// MARK: - Setup
private extension GroupListCollectionViewCell {
    func setupUI() {
        self.layer.cornerRadius = CornerRadius.big
        self.layer.borderWidth = 1
        self.layer.borderColor = UIColor.primaryDarkGray.cgColor
        
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
