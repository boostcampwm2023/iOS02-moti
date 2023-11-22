//
//  DetailAchievementViewController.swift
//
//
//  Created by Kihyun Lee on 11/22/23.
//

import UIKit
import Design

final class DetailAchievementViewController: BaseViewController<DetailAchievementView> {
    weak var coordinator: DetailAchievementCoordinator?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        layoutView.achievementView.readOnlyMode()
        layoutView.achievementView.update(image: MotiImage.sample1)
        layoutView.achievementView.categoryButton.addTarget(self, action: #selector(showPicker), for: .touchUpInside)
    }
    
    @objc private func showPicker() {
        layoutView.achievementView.showCategoryPicker()
    }
}
