//
//  AchievementCollectionViewCell.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit
import Design

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
    
    func configure(imageURL: String) {
        imageView.image = MotiImage.sample1
    }
    
    func showSkeleton() {
        imageView.backgroundColor = .lightGray
    }
    
    func hideSkeleton() {
        imageView.backgroundColor = .clear
    }

    func cancelDownloadImage() {
//        imageView.jf.cancelDownloadImage()
    }
}
