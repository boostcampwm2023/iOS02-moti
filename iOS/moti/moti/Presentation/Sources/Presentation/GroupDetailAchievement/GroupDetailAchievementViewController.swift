//
//  GroupDetailAchievementViewController.swift
//  
//
//  Created by 유정주 on 12/3/23.
//

import UIKit

final class GroupDetailAchievementViewController: BaseViewController<GroupDetailAchievementView> {

    // MARK: - Properties
    private let viewModel: GroupDetailAchievementViewModel
    weak var coordinator: GroupDetailAchievementCoordinator?
    
    // MARK: - Init
    init(viewModel: GroupDetailAchievementViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()

    }
}
