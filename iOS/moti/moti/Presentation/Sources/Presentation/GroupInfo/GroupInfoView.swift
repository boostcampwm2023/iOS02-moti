//
//  GroupInfoView.swift
//
//
//  Created by Kihyun Lee on 12/4/23.
//

import UIKit
import Design
import Domain

final class GroupInfoView: UIView {

    let imageViewSize: CGFloat = 130
    let cameraIconSize: CGFloat = 35
    
    // MARK: - Views
    private lazy var imageView: UIImageView = {
        let imageView = UIImageView()
        imageView.isAccessibilityElement = true
        imageView.clipsToBounds = true
        imageView.layer.cornerRadius = imageViewSize / 2
        imageView.backgroundColor = .primaryDarkGray
        imageView.image = MotiImage.skeleton
        return imageView
    }()
    
    private lazy var cameraIcon: UIButton = {
        let button = UIButton()
        button.layer.cornerRadius = cameraIconSize / 2
        button.setImage(SymbolImage.camera, for: .normal)
        button.backgroundColor = .gray
        button.tintColor = .motiBackground
        button.alpha = 0.7
        return button
    }()
    
    private let groupNameLabel: UILabel = {
        let label = UILabel()
        label.font = .largeBold
        return label
    }()
    
    private let groupCodeLabel: UILabel = {
        let label = UILabel()
        label.font = .mediumBold
        return label
    }()
    
    private(set) var tableView: UITableView = {
        let tableView = UITableView()
        tableView.register(GroupInfoTableViewCell.self, forCellReuseIdentifier: GroupInfoTableViewCell.identifier)
        tableView.backgroundColor = .motiBackground
        tableView.alwaysBounceVertical = false
        return tableView
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
    
    func configure(group: Group) {
        groupNameLabel.text = group.name
        
        imageView.accessibilityLabel = group.name
        if let url = group.avatarUrl {
            imageView.jk.setImage(with: url, imageType: .original)
        }
        
        if group.grade != .leader {
            cameraIcon.isHidden = true
        }
        
        groupCodeLabel.text = "@\(group.code)"
    }
    
    func cancelDownloadImage() {
        imageView.jk.cancelDownloadImage()
    }
}

extension GroupInfoView {

    private func setupUI() {
        // TODO: 그룹 프로필 편집 도입시 보여야 함
        cameraIcon.isHidden = true
        
        addSubview(imageView)
        imageView.atl
            .size(width: imageViewSize, height: imageViewSize)
            .top(equalTo: safeAreaLayoutGuide.topAnchor, constant: 30)
            .centerX(equalTo: safeAreaLayoutGuide.centerXAnchor)
        
        addSubview(groupNameLabel)
        groupNameLabel.atl
            .top(equalTo: imageView.bottomAnchor, constant: 20)
            .centerX(equalTo: safeAreaLayoutGuide.centerXAnchor)
        
        addSubview(groupCodeLabel)
        groupCodeLabel.atl
            .top(equalTo: groupNameLabel.bottomAnchor, constant: 5)
            .centerX(equalTo: safeAreaLayoutGuide.centerXAnchor)
        
        addSubview(cameraIcon)
        cameraIcon.atl
            .size(width: cameraIconSize, height: cameraIconSize)
            .bottom(equalTo: imageView.bottomAnchor, constant: -3)
            .right(equalTo: imageView.rightAnchor, constant: -3)
        
        addSubview(tableView)
        tableView.atl
            .top(equalTo: groupCodeLabel.bottomAnchor, constant: 30)
            .bottom(equalTo: self.bottomAnchor)
            .horizontal(equalTo: safeAreaLayoutGuide)
    }
}
