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
    // MARK: - Views
    private lazy var imageView: UIImageView = {
        let imageView = UIImageView()
        imageView.clipsToBounds = true
        imageView.layer.cornerRadius = imageViewSize / 2
        imageView.backgroundColor = .primaryDarkGray
        imageView.image = MotiImage.skeleton
        return imageView
    }()
    
    private lazy var cameraIcon: UIButton = {
        let button = UIButton()
        button.layer.cornerRadius = cameraIconSzie / 2
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
        if let url = group.avatarUrl {
            imageView.jf.setImage(with: url)
        }
        
        if group.grade != .leader {
            cameraIcon.isHidden = true
        }
    }
    
    func cancelDownloadImage() {
        imageView.jf.cancelDownloadImage()
    }
    
}

extension GroupInfoView {
    private func setupUI() {
        addSubview(imageView)
        imageView.atl
            .size(width: imageViewSize, height: imageViewSize)
            .top(equalTo: safeAreaLayoutGuide.topAnchor, constant: 30)
            .centerX(equalTo: safeAreaLayoutGuide.centerXAnchor)
        
        addSubview(groupNameLabel)
        groupNameLabel.atl
            .top(equalTo: imageView.bottomAnchor, constant: 20)
            .centerX(equalTo: safeAreaLayoutGuide.centerXAnchor)
    }
}
