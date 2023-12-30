//
//  BlockedUserListCollectionViewCell.swift
//
//
//  Created by Kihyun Lee on 12/29/23.
//

import UIKit
import Domain
import Jeongfisher
import Design

protocol BlockedUserListCollectionViewCellDelegate: AnyObject {
    func unblockButtonDidClicked()
}

final class BlockedUserListCollectionViewCell: UICollectionViewCell {
    
    // MARK: - Properties
    private let iconSize: CGFloat = 60
    weak var delegate: BlockedUserListCollectionViewCellDelegate?
    
    // MARK: - Views
    private lazy var iconImageView = {
        let imageView = UIImageView()
        imageView.isAccessibilityElement = true
        imageView.image = SymbolImage.personProfile
        imageView.contentMode = .scaleAspectFit
        imageView.clipsToBounds = true
        imageView.layer.cornerRadius = iconSize / 2.0
        imageView.tintColor = .primaryDarkGray
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
    
    private let blockDateLabel = {
        let label = UILabel()
        label.font = .medium
        label.numberOfLines = 1
        return label
    }()
    
    private var unblockButton = {
        let button = UIButton(type: .system)
        button.setTitle("차단 해제", for: .normal)
        button.setTitleColor(.red, for: .normal)
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
    func configure(with blockedUser: BlockedUser) {
        if let url = blockedUser.user.avatarURL {
            iconImageView.jk.setImage(with: url, downsamplingScale: 1.5)
        }
        userCodeLabel.text = "@" + blockedUser.user.code
        guard let blockDate = blockedUser.createdAt else { return }
        blockDateLabel.text = blockDate.convertStringYYYY년_MM월_dd일() + " 차단"
    }
    
    func cancelDownloadImage() {
        iconImageView.jk.cancelDownloadImage()
    }
}

// MARK: - Setup
private extension BlockedUserListCollectionViewCell {
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
        labelStackView.addArrangedSubview(blockDateLabel)
        
        addSubview(labelStackView)
        labelStackView.atl
            .centerY(equalTo: iconImageView.centerYAnchor)
            .left(equalTo: iconImageView.rightAnchor, constant: 20)
    }
    
    func setupGradeButton() {
        addSubview(unblockButton)
        unblockButton.atl
            .centerY(equalTo: iconImageView.centerYAnchor)
            .right(equalTo: contentView.safeAreaLayoutGuide.rightAnchor, constant: -15)
    }
}
