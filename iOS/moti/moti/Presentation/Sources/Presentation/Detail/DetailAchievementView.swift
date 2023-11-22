//
//  DetailAchievementView.swift
//
//
//  Created by Kihyun Lee on 11/22/23.
//

import UIKit
import Design

final class DetailAchievementView: UIView {
    
    // MARK: - Views
    let achievementView = AchievementView()
    
    // MARK: - Init
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupUI()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupUI()
    }
}

private extension DetailAchievementView {
    func setupUI() {
        setupAchievementView()
    }
    
    func setupAchievementView() {
        addSubview(achievementView)
        achievementView.atl
            .top(equalTo: safeAreaLayoutGuide.topAnchor)
            .bottom(equalTo: bottomAnchor)
            .horizontal(equalTo: safeAreaLayoutGuide)
    }
}
