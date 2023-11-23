//
//  DetailAchievementView.swift
//
//
//  Created by Kihyun Lee on 11/22/23.
//

import UIKit
import Design

final class DetailAchievementView: UIView {
    
    // MARK: - Views
    private let titleLabel = {
        let label = UILabel()
        label.text = "달성 기록 제목"
        label.font = .largeBold
        return label
    }()
    
    private let categoryLabel = {
        let label = UILabel()
        label.text = "카테고리 이름"
        label.font = .medium
        return label
    }()
    
    private let imageView: UIImageView = {
        let imageView = UIImageView()
        imageView.contentMode = .scaleAspectFill
        imageView.backgroundColor = .gray
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
}

private extension DetailAchievementView {
    private func setupUI() {
        setupImageView()
        setupTitleLabel()
        setupCategoryLabel()
    }
    
    private func setupCategoryLabel() {
        addSubview(categoryLabel)
        categoryLabel.atl
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
            .bottom(equalTo: titleLabel.topAnchor, constant: -5)
    }

    private func setupTitleLabel() {
        addSubview(titleLabel)
        titleLabel.atl
            .horizontal(equalTo: safeAreaLayoutGuide, constant: 20)
            .bottom(equalTo: imageView.topAnchor, constant: -10)
    }
    
    private func setupImageView() {
        addSubview(imageView)
        imageView.atl
            .horizontal(equalTo: safeAreaLayoutGuide)
            .height(equalTo: imageView.widthAnchor)
            .centerY(equalTo: safeAreaLayoutGuide.centerYAnchor, constant: -50)
    }
}
