//
//  GroupInfoTableViewCell.swift
//
//
//  Created by Kihyun Lee on 12/4/23.
//

import UIKit

final class GroupInfoTableViewCell: UITableViewCell {

    
    // MARK: - Views
    private let label: UILabel = {
        let label = UILabel()
        return label
    }()
    
    // MARK: - Init
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
       super.init(style: style, reuseIdentifier: reuseIdentifier)
       setupUI()
   }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    // MARK: - Methods
    func configure(with text: String) {
        label.text = text
    }
}

// MARK: - Setup
private extension GroupInfoTableViewCell {

    func setupUI() {
        backgroundColor = .motiBackground
        accessoryType = .disclosureIndicator
        
        addSubview(label)
        label.atl
            .centerY(equalTo: self.centerYAnchor)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 30)
    }
}
