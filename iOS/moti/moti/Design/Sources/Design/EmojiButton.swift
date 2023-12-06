//
//  EmojiButton.swift
//  
//
//  Created by 유정주 on 12/3/23.
//

import UIKit

public final class EmojiButton: BounceButton {
    public let emoji: String
    private var isSelectedEmoji = false {
        didSet {
            if isSelectedEmoji {
                applySelectedStyle()
            } else {
                applyDeselectedStyle()
            }
        }
    }
    private var count = 0 {
        didSet {
            if count <= 0 {
                countLabel.isHidden = true
            } else {
                countLabel.isHidden = false
                countLabel.text = "+\(count)"
            }
        }
    }
    
    // MARK: - Views
    private let stackView = {
        let stackView = UIStackView()
        stackView.translatesAutoresizingMaskIntoConstraints = false
        stackView.isUserInteractionEnabled = false
        stackView.axis = .horizontal
        stackView.distribution = .equalSpacing
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
        label.font = UIFont.systemFont(ofSize: 16)
        label.isHidden = true
        return label
    }()
    
    // MARK: - Init
    public override init(frame: CGRect) {
        self.emoji = ""
        super.init(frame: frame)
        setupUI()
    }
    
    public init(
        frame: CGRect = .zero,
        emoji: String,
        emojiId: String,
        count: Int,
        isSelectedEmoji: Bool
    ) {
        self.emoji = emoji
        super.init(frame: frame)
        
        self.count = count
        self.isSelectedEmoji = isSelectedEmoji
        self.emojiLabel.text = emoji
        
        setupUI()
        updateUI()
    }
    
    public required init?(coder: NSCoder) {
        self.emoji = ""
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
    
    public func update(count: Int, isSelectedEmoji: Bool) {
        self.count = count
        self.isSelectedEmoji = isSelectedEmoji
    }
    
    @objc public func toggle() {
        isSelectedEmoji.toggle()
        if isSelectedEmoji {
            increaseCount()
        } else {
            decreaseCount()
        }
    }
    
    private func increaseCount() {
        // TODO: 숫자가 위로 올라가는 애니메이션
        count += 1
    }
    
    private func decreaseCount() {
        // TODO: 숫자가 아래로 내려가는 애니메이션
        count -= 1
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
    
    private func updateUI() {
        if isSelectedEmoji {
            applySelectedStyle()
        } else {
            applyDeselectedStyle()
        }

        if count == 0 {
            countLabel.isHidden = true
        } else {
            countLabel.isHidden = false
            countLabel.text = "+\(count)"
        }
    }
    
    private func applySelectedStyle() {
        applyHighlightUI()
        countLabel.textColor = .white
    }
    
    private func applyDeselectedStyle() {
        applyNormalUI()
        countLabel.textColor = .black
    }
}
