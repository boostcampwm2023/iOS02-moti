//
//  DetailAchievementViewController.swift
//
//
//  Created by Kihyun Lee on 11/22/23.
//

import UIKit
import Design
import Core

final class DetailAchievementViewController: BaseViewController<DetailAchievementView> {
    weak var coordinator: DetailAchievementCoordinator?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupUI()
    }
    
    private func setupUI() {
        navigationItem.rightBarButtonItems = [
            UIBarButtonItem(title: "삭제", style: .plain, target: self, action: #selector(didClickedRemoveButton)),
            UIBarButtonItem(title: "편집", style: .plain, target: self, action: #selector(didClickedEditButton))
        ]
    }
    
    @objc private func didClickedRemoveButton() {
        Logger.debug("삭제 버튼!")
    }
    
    @objc private func didClickedEditButton() {
        Logger.debug("편집 버튼!")
    }
}
