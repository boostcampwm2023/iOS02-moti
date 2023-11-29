//
//  DetailAchievementView.swift
//
//
//  Created by Kihyun Lee on 11/22/23.
//

import UIKit
import Design
import Domain

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
        imageView.contentMode = .scaleAspectFill
        imageView.backgroundColor = .primaryDarkGray
        imageView.image = MotiImage.skeleton
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
        return textView
    }()
    
    private let infoTitleLabel: UILabel = {
        let label = UILabel()
        label.text = "정보"
        label.numberOfLines = 1
        label.textColor = .gray
        label.font = .medium
        return label
    }()
    
    private let categoryInfoLabel: UILabel = {
        let label = UILabel()
        label.numberOfLines = 1
        label.font = .medium
        return label
    }()
    
    private let continuedInfoLabel: UILabel = {
        let label = UILabel()
        label.numberOfLines = 1
        label.textColor = .gray
        label.font = .medium
        return label
    }()
    
    private let dateTitleInfoLabel: UILabel = {
        let label = UILabel()
        label.text = "날짜"
        label.font = .medium
        return label
    }()
    
    private let dateInfoLabel: UILabel = {
        let label = UILabel()
        label.numberOfLines = 1
        label.textColor = .gray
        label.font = .medium
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
    
    func configure(achievement: Achievement) {
        titleLabel.text = achievement.title
        categoryLabel.text = achievement.category?.name
        if let url = achievement.imageURL {
            imageView.jf.setImage(with: url)
        }
        
        bodyTextView.text = achievement.body
        categoryInfoLabel.text = achievement.category?.name
        continuedInfoLabel.text = "\(achievement.category?.continued ?? 0)회차"
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy년 MM월 dd일"
        let dateString = dateFormatter.string(from: achievement.date ?? .now)
        dateInfoLabel.text = dateString
    }
    
    func update(title: String) {
        titleLabel.text = title
    }
    
    func cancelDownloadImage() {
        imageView.jf.cancelDownloadImage()
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
        setupInfoTitleLabel()
        setupInfoLabels()
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
            .top(equalTo: titleLabel.bottomAnchor, constant: 10)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor)
            .right(equalTo: safeAreaLayoutGuide.rightAnchor)
            .height(equalTo: imageView.widthAnchor)
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
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
            .right(equalTo: safeAreaLayoutGuide.rightAnchor, constant: -20)
        
        // TODO: 더보기 동적 높이
        bodyTextView.heightAnchor.constraint(greaterThanOrEqualToConstant: 50).isActive = true
        bodyTextView.isScrollEnabled = false
    }
    
    private func setupInfoTitleLabel() {
        scrollView.addSubview(infoTitleLabel)
        infoTitleLabel.atl
            .top(equalTo: bodyTextView.bottomAnchor, constant: 20)
            .left(equalTo: bodyTitleLabel.leftAnchor)
        
        addDividerToBottom(view: infoTitleLabel)
    }
    
    private func setupInfoLabels() {
        scrollView.addSubview(categoryInfoLabel)
        categoryInfoLabel.atl
            .top(equalTo: infoTitleLabel.bottomAnchor, constant: 20)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
        
        scrollView.addSubview(continuedInfoLabel)
        continuedInfoLabel.atl
            .top(equalTo: infoTitleLabel.bottomAnchor, constant: 20)
            .right(equalTo: safeAreaLayoutGuide.rightAnchor, constant: -20)
        
        addDividerToBottom(view: continuedInfoLabel)
        
        scrollView.addSubview(dateTitleInfoLabel)
        dateTitleInfoLabel.atl
            .top(equalTo: categoryInfoLabel.bottomAnchor, constant: 20)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
        
        scrollView.addSubview(dateInfoLabel)
        dateInfoLabel.atl
            .top(equalTo: continuedInfoLabel.bottomAnchor, constant: 20)
            .right(equalTo: safeAreaLayoutGuide.rightAnchor, constant: -20)
            .bottom(equalTo: scrollView.bottomAnchor, constant: -30)
        
        addDividerToBottom(view: dateInfoLabel)
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
