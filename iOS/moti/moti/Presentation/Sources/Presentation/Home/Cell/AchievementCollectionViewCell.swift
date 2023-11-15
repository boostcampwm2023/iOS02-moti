//
//  AchievementCollectionViewCell.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit
import Jeongfisher
import Design

final class AchievementCollectionViewCell: UICollectionViewCell {
    private let imageView = {
        let imageView = UIImageView()
        imageView.contentMode = .scaleAspectFill
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
        if let url = URL(string: imageURL) {
            imageView.jf.setImage(with: url)
        }
    }
    
    func showSkeleton() {
        imageView.backgroundColor = .lightGray
    }
    
    func hideSkeleton() {
        imageView.backgroundColor = .clear
    }

    func cancelDownloadImage() {
        imageView.jf.cancelDownloadImage()
    }
}
