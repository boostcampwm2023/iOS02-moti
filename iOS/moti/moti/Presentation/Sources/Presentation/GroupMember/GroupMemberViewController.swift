//
//  GroupMemberViewController.swift
//
//
//  Created by Kihyun Lee on 12/5/23.
//

import UIKit
import Combine
import Core

final class GroupMemberViewController: BaseViewController<GroupMemberView> {

    // MARK: - Properties
    weak var coordinator: GroupMemberCoordinator?
    private let viewModel: GroupMemberViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    // MARK: - Init
    init(viewModel: GroupMemberViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        
        bind()
        viewModel.action(.launch)
    }
    
    private func setupUI() {
        title = "그룹원"
    }
    
    private func bind() {
        viewModel.$launchState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .initial:
                    break
                case .success:
                    break
                case .failed(let message):
                    Logger.error("Fetch Group Member Error: \(message)")
                }
            }
            .store(in: &cancellables)
    }
}