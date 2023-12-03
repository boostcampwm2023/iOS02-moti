//
//  EmojiButton.swift
//  
//
//  Created by 유정주 on 12/3/23.
//

import UIKit

public final class EmojiButton: BounceButton {
    private var isSelectedEmoji = false
    
    // MARK: - Views
    private let stackView = {
        let stackView = UIStackView()
        stackView.translatesAutoresizingMaskIntoConstraints = false
        stackView.isUserInteractionEnabled = false
        stackView.axis = .horizontal
        stackView.distribution = .fillEqually
        stackView.alignment = .center
        return stackView
    }()
    private let emojiLabel = {
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.isUserInteractionEnabled = false
        label.font = UIFont.systemFont(ofSize: 18) // 디자인시스템에 넣기..? 좀 고민 중
        return label
    }()
    
    private let countLabel = {
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.isUserInteractionEnabled = false
        label.font = UIFont.systemFont(ofSize: 18)
        label.isHidden = true
        return label
    }()
    
    // MARK: - Init
    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }

    // MARK: - Methods
    public override func highlightAction() {
        if isHighlighted {
            bounceAnimation()
        } else {
            normalAnimation()
        }
    }
    
    public func configure(emoji: String, count: Int, isSelectedEmoji: Bool) {
        emojiLabel.text = emoji
        if count == 0 {
            countLabel.isHidden = true
        } else {
            countLabel.isHidden = false
            countLabel.text = "+\(count)"
        }
        
        self.isSelectedEmoji = isSelectedEmoji
        if isSelectedEmoji {
            applyHighlightUI()
            countLabel.textColor = .white
        } else {
            applyNormalUI()
            countLabel.textColor = .black
        }
    }
    
    // MARK: - Setup
    private func setupUI() {
        stackView.addArrangedSubview(emojiLabel)
        stackView.addArrangedSubview(countLabel)
        
        addSubview(stackView)
        NSLayoutConstraint.activate([
            stackView.topAnchor.constraint(equalTo: safeAreaLayoutGuide.topAnchor),
            stackView.bottomAnchor.constraint(equalTo: safeAreaLayoutGuide.bottomAnchor),
            stackView.leftAnchor.constraint(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 8),
            stackView.rightAnchor.constraint(equalTo: safeAreaLayoutGuide.rightAnchor, constant: -8)
        ])
    }
}
