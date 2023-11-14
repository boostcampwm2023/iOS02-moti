//
//  HomeView.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit

final class HomeView: UIView {
    
    // 카테고리 리스트 컬렉션 뷰
    private let categoryCollectionView = {
        let collectionView = UIView()
        collectionView.backgroundColor = .blue
        return collectionView
    }()
    
    // 달성 기록 리스트 컬렉션 뷰
    private let recordCollectionView = {
        let collectionView = UIView()
        collectionView.backgroundColor = .red
        return collectionView
    }()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
    
    private func setupUI() {
        setupCategoryCollectionView()
        setupRecordCollectionView()
    }
    
    private func setupCategoryCollectionView() {
        addSubview(categoryCollectionView)
        categoryCollectionView.atl
            .width(equalTo: self.widthAnchor)
            .height(constant: 50)
            .top(equalTo: self.topAnchor, constant: 120)
    }
    
    private func setupRecordCollectionView() {
        addSubview(recordCollectionView)
        recordCollectionView.atl
            .width(equalTo: self.widthAnchor)
            .top(equalTo: categoryCollectionView.bottomAnchor, constant: 10)
            .bottom(equalTo: self.bottomAnchor, constant: -10)
    }
}
