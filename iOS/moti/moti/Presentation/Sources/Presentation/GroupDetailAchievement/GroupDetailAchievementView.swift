//
//  GroupDetailAchievementView.swift
//  
//
//  Created by 유정주 on 12/3/23.
//

import UIKit
import Design
import Domain
import Data

final class GroupDetailAchievementView: UIView {
    
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
    
    private let emojiButtonStackView: UIStackView = {
        let stackView = UIStackView()
        stackView.axis = .horizontal
        stackView.spacing = 10
        stackView.distribution = .equalSpacing
        return stackView
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
        if let url = achievement.imageURL {
            imageView.jf.setImage(with: url)
        }
        
        bodyTextView.text = achievement.body
        infoView.configure(items: [
            ("작성자", "@ABCDEFG"),
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
        imageView.jf.cancelDownloadImage()
    }
}

// MARK: - setup
private extension GroupDetailAchievementView {
    private func setupUI() {
        setupScrollView()
        
        setupCategoryLabel()
        setupTitleLabel()
        setupImageView()
        
        setupEmojiButtons()
        
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
            .top(equalTo: titleLabel.bottomAnchor, constant: 10)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor)
            .right(equalTo: safeAreaLayoutGuide.rightAnchor)
            .height(equalTo: imageView.widthAnchor)
    }
    
    private func setupEmojiButtons() {
        addSubview(emojiButtonStackView)
        emojiButtonStackView.atl
            .height(constant: 40)
            .top(equalTo: imageView.bottomAnchor, constant: 20)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
        
        // TODO: Emoji Enum으로 정의
        let likeEmojiButton = EmojiButton()
        likeEmojiButton.configure(emoji: "👍", count: 1, isSelectedEmoji: true)
        
        let fireEmojiButton = EmojiButton()
        fireEmojiButton.configure(emoji: "🔥", count: 1, isSelectedEmoji: false)
        
        let smileEmojiButton = EmojiButton()
        smileEmojiButton.configure(emoji: "🥰", count: 0, isSelectedEmoji: false)
        
        emojiButtonStackView.addArrangedSubview(likeEmojiButton)
        emojiButtonStackView.addArrangedSubview(fireEmojiButton)
        emojiButtonStackView.addArrangedSubview(smileEmojiButton)
    }
    
    private func setupBodyTitleLabel() {
        scrollView.addSubview(bodyTitleLabel)
        bodyTitleLabel.atl
            .top(equalTo: emojiButtonStackView.bottomAnchor, constant: 20)
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
