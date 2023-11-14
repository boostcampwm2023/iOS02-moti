//
//  RecordCollectionViewCell.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit
import Jeongfisher

final class RecordCollectionViewCell: UICollectionViewCell {
    static let cellHeight: CGFloat = 130
    private static let placeholder = UIImage(systemName: "photo")?.withTintColor(.lightGray, renderingMode: .alwaysOriginal)
    
    private let imageView = UIImageView()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    private func setupUI() {
        addSubview(imageView)
        imageView.atl
            .all(of: self)
    }
    
    private func reset() {
        imageView.image = nil
    }
    
    func configure(imageURL: String) {
        reset()

        if let url = URL(string: imageURL) {
            imageView.jf.setImage(with: url, placeHolder: Self.placeholder)
        }
    }
    
    func showSkeleton() {
        imageView.backgroundColor = .lightGray
        imageView.image = Self.placeholder
    }
    
    func hideSkeleton() {
        imageView.backgroundColor = .clear
    }

    func cancelDownloadImage() {
        imageView.jf.cancelDownloadImage()
    }
}
