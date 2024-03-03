//
//  EmojiButton.swift
//  
//
//  Created by 유정주 on 12/3/23.
//

import UIKit

public final class EmojiButton: BounceButton, CAAnimationDelegate {

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
        label.font = UIFont.systemFont(ofSize: 18)
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
        // 숫자가 1 이상일 때만 애니메이션
        // 0일 때는 countLabel이 나타나는 효과가 존재함
        if count > 0 {
            pushAnimation(subtype: .fromTop)
        }
        count += 1
    }
    
    private func decreaseCount() {
        count -= 1
        // 숫자가 1 이상일 때만 애니메이션
        // 0일 때는 countLabel이 사라지는 효과가 존재함
        if count > 0 {
            pushAnimation(subtype: .fromBottom)
        }
    }
    
    private func pushAnimation(subtype: CATransitionSubtype) {
        let animation = CATransition()
        animation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
        animation.duration = 0.15
        animation.type = .push
        animation.subtype = subtype
        animation.delegate = self
        
        countLabel.layer.add(animation, forKey: CATransitionType.push.rawValue)
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
        countLabel.textColor = .emojiButtonTitle
    }
}
