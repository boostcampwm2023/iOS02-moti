//
//  RecordCollectionViewCell.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit
import Jeongfisher

final class RecordCollectionViewCell: UICollectionViewCell {
    private static let placeholder = UIImage(systemName: "photo")?.withTintColor(.lightGray, renderingMode: .alwaysOriginal)
    
    private let imageView: UIImageView = {
        let imageView = UIImageView()
        imageView.image = UIImage(systemName: "moon")
        return imageView
    }()
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
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
