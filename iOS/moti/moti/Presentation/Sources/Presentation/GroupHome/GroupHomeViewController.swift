//
//  GroupHomeViewController.swift
//  
//
//  Created by 유정주 on 11/30/23.
//

import UIKit

final class GroupHomeViewController: BaseViewController<HomeView> {
    
    // MARK: - Properties
    weak var coordinator: GroupHomeCoordinator?
    private let viewModel: GroupHomeViewModel
    
    // MARK: - Init
    init(viewModel: GroupHomeViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
}
