//
//  CategoryCollectionViewCell.swift
//  
//
//  Created by 유정주 on 11/15/23.
//

import UIKit
import Design

final class CategoryCollectionViewCell: UICollectionViewCell {

    private let label: UILabel = {
        let label = UILabel()
        
        label.numberOfLines = 1
        label.font = .medium
        label.textAlignment = .center
        
        return label
    }()
    
    override var isHighlighted: Bool {
        didSet {
            if isHighlighted {
                bounceAnimation(with: { [weak self] in
                    self?.applyHighlightUI()
                })
            } else {
                normalAnimation(with: { [weak self] in
                    self?.applyNormalUI()
                })
            }
        }
    }
    
    // Selected 상태일 때 파란색 적용
    override var isSelected: Bool {
        didSet {
            isSelected ? applyHighlightUI() : applyNormalUI()
        }
    }
    
    // MARK: - Init
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    private func setupUI() {
        self.applyNormalUI()
        self.layer.cornerRadius = CornerRadius.big
        
        addSubview(label)
        label.atl
            .centerY(equalTo: centerYAnchor)
            .left(equalTo: leftAnchor, constant: 10)
            .right(equalTo: rightAnchor, constant: -10)
    }
    
    // MARK: - Methods
    func configure(with title: String) {
        label.text = title
    }
    
    override func applyHighlightUI() {
        super.applyHighlightUI()
        label.textColor = .bounceButtonHighlightTitleColor
    }
    
    override func applyNormalUI() {
        super.applyNormalUI()
        label.textColor = .buttonTitleColor
    }
}
