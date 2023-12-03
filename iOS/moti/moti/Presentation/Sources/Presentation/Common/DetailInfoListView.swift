//
//  DetailInfoListView.swift
//  
//
//  Created by 유정주 on 12/3/23.
//

import UIKit

final class DetailInfoListView: UIView {
    private let titleLabel: UILabel = {
        let label = UILabel()
        label.text = "정보"
        label.numberOfLines = 1
        label.textColor = .gray
        label.font = .medium
        return label
    }()
    
    private let divider = {
        let view = UIView()
        view.backgroundColor = .systemGray5
        return view
    }()

    private var stackView = {
        let stackView = UIStackView()
        stackView.axis = .vertical
        return stackView
    }()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    func configure(items: [(title: String, content: String)]) {
        for item in items {
            addItem(title: item.title, content: item.content)
        }
    }
    
    private func addItem(title: String, content: String) {
        let listItemView = DetailInfoListItemView()
        listItemView.configure(title: title, content: content)
        stackView.addArrangedSubview(listItemView)
        listItemView.atl
            .height(constant: 34)
        
        let divider = UIView()
        divider.backgroundColor = .systemGray5
        stackView.addArrangedSubview(divider)
        divider.atl
            .height(constant: 1)
    }
    
    private func setupUI() {
        addSubview(titleLabel)
        titleLabel.atl
            .top(equalTo: safeAreaLayoutGuide.topAnchor)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
        
        addSubview(divider)
        divider.atl
            .height(constant: 1)
            .top(equalTo: titleLabel.bottomAnchor, constant: 9)
            .horizontal(equalTo: safeAreaLayoutGuide)
        
        addSubview(stackView)
        stackView.atl
            .top(equalTo: divider.bottomAnchor)
            .bottom(equalTo: bottomAnchor)
            .horizontal(equalTo: safeAreaLayoutGuide)
    }
}

final class DetailInfoListItemView: UIView {
    private let titleLabel: UILabel = {
        let label = UILabel()
        label.numberOfLines = 1
        label.font = .medium
        return label
    }()
    
    private let contentLabel: UILabel = {
        let label = UILabel()
        label.numberOfLines = 1
        label.textColor = .gray
        label.font = .medium
        return label
    }()

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    func configure(title: String, content: String) {
        titleLabel.text = title
        contentLabel.text = content
    }

    private func setupUI() {
        addSubview(titleLabel)
        titleLabel.atl
            .top(equalTo: safeAreaLayoutGuide.topAnchor)
            .centerY(equalTo: safeAreaLayoutGuide.centerYAnchor)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
        
        addSubview(contentLabel)
        contentLabel.atl
            .top(equalTo: safeAreaLayoutGuide.topAnchor)
            .centerY(equalTo: safeAreaLayoutGuide.centerYAnchor)
            .right(equalTo: safeAreaLayoutGuide.rightAnchor, constant: -20)
    }
}
