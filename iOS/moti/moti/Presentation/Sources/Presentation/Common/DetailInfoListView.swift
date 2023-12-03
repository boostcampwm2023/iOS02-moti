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
        stackView.distribution = .fillEqually
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
    }
    
    private func setupUI() {
        addSubview(titleLabel)
        titleLabel.atl
            .top(equalTo: safeAreaLayoutGuide.topAnchor)
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
        
        addSubview(divider)
        divider.atl
            .height(constant: 1)
            .top(equalTo: bottomAnchor, constant: 9)
            .horizontal(equalTo: safeAreaLayoutGuide)
        
        addSubview(stackView)
        stackView.atl
            .top(equalTo: titleLabel.bottomAnchor)
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
    
    private let divider = {
        let view = UIView()
        view.backgroundColor = .systemGray5
        return view
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
            .left(equalTo: safeAreaLayoutGuide.leftAnchor, constant: 20)
        
        addSubview(contentLabel)
        contentLabel.atl
            .right(equalTo: safeAreaLayoutGuide.rightAnchor, constant: -20)
        
        addSubview(divider)
        divider.atl
            .height(constant: 1)
            .top(equalTo: bottomAnchor, constant: 9)
            .left(equalTo: leftAnchor, constant: 20)
            .right(equalTo: rightAnchor)
    }
}
