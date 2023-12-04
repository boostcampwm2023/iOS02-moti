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
    
    // MARK: - Views
    private let imageView: UIImageView = {
        let imageView = UIImageView()
        imageView.contentMode = .scaleAspectFill
        imageView.backgroundColor = .primaryDarkGray
        imageView.image = MotiImage.skeleton
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
    
    func configure(group: Group) {
        if let url = group.avatarUrl {
            imageView.jf.setImage(with: url)
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
            .center(of: self)
    }
}
