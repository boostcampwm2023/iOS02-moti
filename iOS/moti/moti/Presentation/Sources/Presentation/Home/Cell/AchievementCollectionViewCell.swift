//
//  AchievementCollectionViewCell.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit
import Design
import Jeongfisher
import JKImageCache

final class AchievementCollectionViewCell: UICollectionViewCell {
    private let imageView = {
        let imageView = UIImageView()
        imageView.contentMode = .scaleAspectFill
        imageView.clipsToBounds = true
        return imageView
    }()
    
    private let iconImageView = {
        let imageView = UIImageView()
        imageView.isHidden = true
        imageView.contentMode = .scaleAspectFill
        imageView.clipsToBounds = true
        imageView.layer.cornerRadius = 15
        imageView.layer.borderWidth = 1
        imageView.layer.borderColor = UIColor.motiBackground.cgColor
        return imageView
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
        addSubview(imageView)
        imageView.atl
            .all(of: self)
        
        addSubview(iconImageView)
        iconImageView.atl
            .size(width: 30, height: 30)
            .right(equalTo: imageView.rightAnchor, constant: -5)
            .bottom(equalTo: imageView.bottomAnchor, constant: -5)
    }
    
    // MARK: - Methods
    override func prepareForReuse() {
        super.prepareForReuse()
        imageView.image = nil
        iconImageView.isHidden = true
    }
    
    func configure(imageURL: URL?, avatarURL: URL? = nil) {
        if let imageURL {
            imageView.jk.setImage(with: imageURL, placeHolder: MotiImage.skeleton, downsamplingScale: 1.5)
        } else {
            imageView.image = MotiImage.skeleton
            imageView.backgroundColor = .primaryDarkGray
        }
        
        if let avatarURL {
            iconImageView.isHidden = false
            iconImageView.jk.setImage(with: avatarURL, placeHolder: MotiImage.skeleton, downsamplingScale: 1.5)
        }
    }
    
    func showSkeleton() {
        imageView.image = MotiImage.skeleton
        imageView.backgroundColor = .primaryDarkGray
    }
    
    func hideSkeleton() {
        imageView.backgroundColor = .primaryGray
    }

    func cancelDownloadImage() {
        imageView.jk.cancelDownloadImage()
    }
}
