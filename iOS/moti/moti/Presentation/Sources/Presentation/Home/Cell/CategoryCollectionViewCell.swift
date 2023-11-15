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
    
    // Highlighted 상태일 때 Bounce 애니메이션 적용
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
        contentView.layer.masksToBounds = true
        contentView.layer.cornerRadius = contentView.frame.height / 2
        
        addSubview(label)
        label.atl
            .all(of: self)
    }
    
    // MARK: - Methods
    override func prepareForReuse() {
        super.prepareForReuse()
        isSelected = false
    }
    
    func configure(with title: String) {
        
    }
}
