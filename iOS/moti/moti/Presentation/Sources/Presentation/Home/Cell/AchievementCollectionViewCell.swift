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
    }
    
    // MARK: - Methods
    override func prepareForReuse() {
        super.prepareForReuse()
        imageView.image = nil
    }
    
    func configure(imageURL: URL?) {
        if let imageURL {
            imageView
                .jk.setImage(with: imageURL, placeHolder: MotiImage.skeleton)
        } else {
            imageView.image = MotiImage.skeleton
            imageView.backgroundColor = .primaryDarkGray
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
