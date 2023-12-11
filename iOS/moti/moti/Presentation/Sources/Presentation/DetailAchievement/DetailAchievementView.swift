//
//  DetailAchievementView.swift
//
//
//  Created by Kihyun Lee on 11/22/23.
//

import UIKit
import Design
import Domain
import Data
import JKImageCache

final class DetailAchievementView: UIView {
    
    // MARK: - Views
    let scrollView: UIScrollView = {
      let scrollView = UIScrollView()
      return scrollView
    }()
    
    private let categoryLabel = {
        let label = UILabel()
        label.numberOfLines = 1
        label.font = .medium
        return label
    }()
    
    private let titleLabel = {
        let label = UILabel()
        label.numberOfLines = 1
        label.font = .largeBold
        return label
    }()
    
    private let imageView: UIImageView = {
        let imageView = UIImageView()
        imageView.isAccessibilityElement = true
        imageView.contentMode = .scaleAspectFill
        imageView.backgroundColor = .primaryDarkGray
        imageView.image = MotiImage.smallSkeleton
        imageView.clipsToBounds = true
        return imageView
    }()
    
    private let bodyTitleLabel: UILabel = {
        let label = UILabel()
        label.text = "내용"
        label.numberOfLines = 1
        label.textColor = .gray
        label.font = .medium
        return label
    }()
    
    private let bodyTextView: UITextView = {
        let textView = UITextView()
        textView.font = .medium
        textView.backgroundColor = .motiBackground
        textView.isEditable = false
        return textView
    }()
    
    private let infoView = DetailInfoListView()

    // MARK: - Init
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    func configure(achievement: Achievement) {
        titleLabel.text = achievement.title
        categoryLabel.text = achievement.category?.name
        
        imageView.accessibilityLabel = achievement.title
        if let url = achievement.imageURL {
            imageView.jk.setImage(with: url, imageType: .original)
        }
        
        if let body = achievement.body, !body.isEmpty {
            bodyTextView.text = body
        } else {
            bodyTextView.text = "없음"
        }
        infoView.configure(items: [
            (achievement.category?.name ?? "", "\(achievement.category?.continued ?? 0)회차"),
            ("날짜", (achievement.date ?? .now).convertStringYYYY년_MM월_dd일())
        ])
    }
    
    func update(title: String) {
        titleLabel.text = title
    }
    
    func update(updatedAchievement: Achievement) {
        categoryLabel.text = updatedAchievement.category?.name
        titleLabel.text = updatedAchievement.title
        bodyTextView.text = updatedAchievement.body
    }
    
    func cancelDownloadImage() {
        imageView.jk.cancelDownloadImage()
    }
}

// MARK: - setup
private extension DetailAchievementView {
    private func setupUI() {
        setupScrollView()
        
        setupCategoryLabel()
        setupTitleLabel()
        setupImageView()
        
        setupBodyTitleLabel()
        setupBodyTextView()
        setupInfoView()
    }
    
    private func setupScrollView() {
        addSubview(scrollView)
        scrollView.atl
            .top(equalTo: safeAreaLayoutGuide.topAnchor)
            .bottom(equalTo: bottomAnchor)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor)
            .right(equalTo: safeAreaLayoutGuide.rightAnchor)
    }
    
    private func setupCategoryLabel() {
        scrollView.addSubview(categoryLabel)
        categoryLabel.atl
            .top(equalTo: scrollView.topAnchor, constant: 10)
            .left(equalTo: scrollView.leftAnchor, constant: 20)
    }

    private func setupTitleLabel() {
        scrollView.addSubview(titleLabel)
        titleLabel.atl
            .top(equalTo: categoryLabel.bottomAnchor, constant: 7)
            .left(equalTo: categoryLabel.leftAnchor)
    }
    
    private func setupImageView() {
        scrollView.addSubview(imageView)
        imageView.atl
            .height(equalTo: imageView.widthAnchor)
            .top(equalTo: titleLabel.bottomAnchor, constant: 10)
            .centerX(equalTo: safeAreaLayoutGuide.centerXAnchor)
        
        let widthConstraint = imageView.widthAnchor.constraint(equalTo: safeAreaLayoutGuide.widthAnchor)
        widthConstraint.priority = .defaultHigh
        NSLayoutConstraint.activate([
            imageView.widthAnchor.constraint(lessThanOrEqualToConstant: 400),
            widthConstraint
        ])
    }
    
    private func setupBodyTitleLabel() {
        scrollView.addSubview(bodyTitleLabel)
        bodyTitleLabel.atl
            .top(equalTo: imageView.bottomAnchor, constant: 70)
            .left(equalTo: titleLabel.leftAnchor)
        
        addDividerToBottom(view: bodyTitleLabel)
    }
    
    private func setupBodyTextView() {
        scrollView.addSubview(bodyTextView)
        bodyTextView.atl
            .top(equalTo: bodyTitleLabel.bottomAnchor, constant: 10)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 15)
            .right(equalTo: safeAreaLayoutGuide.rightAnchor, constant: -15)
        
        // TODO: 더보기 동적 높이
        bodyTextView.heightAnchor.constraint(greaterThanOrEqualToConstant: 50).isActive = true
        bodyTextView.isScrollEnabled = false
    }
    
    private func setupInfoView() {
        scrollView.addSubview(infoView)
        infoView.atl
            .top(equalTo: bodyTextView.bottomAnchor, constant: 10)
            .bottom(equalTo: scrollView.bottomAnchor, constant: -30)
            .horizontal(equalTo: scrollView.safeAreaLayoutGuide)
    }
    
    private func addDividerToBottom(view: UIView) {
        let divider = UIView()
        divider.backgroundColor = .systemGray5
        scrollView.addSubview(divider)
        divider.atl
            .horizontal(equalTo: safeAreaLayoutGuide)
            .top(equalTo: view.bottomAnchor, constant: 9)
            .height(constant: 1)
        
    }
    
}
