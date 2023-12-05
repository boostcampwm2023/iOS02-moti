//
//  GroupMemberCollectionViewCell.swift
//
//
//  Created by Kihyun Lee on 12/5/23.
//

import UIKit
import Domain
import Jeongfisher
import Design

final class GroupMemberCollectionViewCell: UICollectionViewCell {
    
    // MARK: - Properties
    private let iconSize: CGFloat = 60
    
    // MARK: - Views
    private lazy var iconImageView = {
        let imageView = UIImageView()
        imageView.image = MotiImage.logoBlue
        imageView.contentMode = .scaleAspectFit
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
    
    private let userCodeLabel = {
        let label = UILabel()
        label.font = .mediumBold
        label.numberOfLines = 1
        return label
    }()
    
    private let lastChallengedLabel = {
        let label = UILabel()
        label.font = .medium
        label.numberOfLines = 1
        return label
    }()
    
    private let gradeButton = {
        let button = UIButton()
        button.setTitleColor(.black, for: .normal)
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
    func configure(with groupMember: GroupMember) {
        if let url = groupMember.user.avatarURL {
            iconImageView.jf.setImage(with: url)
        }
        userCodeLabel.text = groupMember.user.code
        lastChallengedLabel.text = groupMember.displayLastChallenged
        gradeButton.setTitle(groupMember.grade.description, for: .normal)
    }
    
    func cancelDownloadImage() {
        iconImageView.jf.cancelDownloadImage()
    }
}

// MARK: - Setup
private extension GroupMemberCollectionViewCell {
    func setupUI() {
        self.layer.cornerRadius = CornerRadius.big
        self.layer.borderWidth = 1
        self.layer.borderColor = UIColor.primaryDarkGray.cgColor
        
        setupIconImageView()
        setupStackView()
        setupGradeButton()
    }
    
    func setupIconImageView() {
        addSubview(iconImageView)
        iconImageView.atl
            .size(width: iconSize, height: iconSize)
            .centerY(equalTo: contentView.safeAreaLayoutGuide.centerYAnchor)
            .left(equalTo: contentView.safeAreaLayoutGuide.leftAnchor, constant: 20)
    }
    
    func setupStackView() {
        labelStackView.addArrangedSubview(userCodeLabel)
        labelStackView.addArrangedSubview(lastChallengedLabel)
        
        addSubview(labelStackView)
        labelStackView.atl
            .centerY(equalTo: iconImageView.centerYAnchor)
            .left(equalTo: iconImageView.rightAnchor, constant: 20)
    }
    
    func setupGradeButton() {
        addSubview(gradeButton)
        gradeButton.atl
            .centerY(equalTo: iconImageView.centerYAnchor)
            .right(equalTo: contentView.safeAreaLayoutGuide.rightAnchor, constant: -15)
    }
}
