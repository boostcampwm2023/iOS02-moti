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
        title = "그룹원"
        setupGroupMemberDataSource()
        
        bind()
        viewModel.action(.launch)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        if let tabBarController = tabBarController as? TabBarViewController {
            tabBarController.hideTabBar()
        }
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        if let tabBarController = tabBarController as? TabBarViewController {
            tabBarController.showTabBar()
        }
    }
    
    private func setupGroupMemberDataSource() {
        layoutView.groupMemberCollectionView.delegate = self
        let dataSource = GroupMemberViewModel.GroupMemberDataSource.DataSource(
            collectionView: layoutView.groupMemberCollectionView,
            cellProvider: { collectionView, indexPath, item in
                let cell: GroupMemberCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                cell.configure(with: item)
                return cell
            }
        )
        
        let diffableDataSource = GroupMemberViewModel.GroupMemberDataSource(dataSource: dataSource)
        viewModel.setupDataSource(diffableDataSource)
    }
    
    private func bind() {
        viewModel.groupMemberListState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .success:
                    break
                case .failed(let message):
                    Logger.error("Fetch Group Member Error: \(message)")
                }
            }
            .store(in: &cancellables)
    }
}

extension GroupMemberViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        guard let cell = collectionView.cellForItem(at: indexPath) as? GroupMemberCollectionViewCell else {
            return
        }
        
        UIView.animate(withDuration: 0.08, animations: {
            let scale = CGAffineTransform(scaleX: 0.95, y: 0.95)
            cell.transform = scale
        }, completion: { _ in
            cell.transform = .identity
        })
    }
}
