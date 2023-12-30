//
//  BlockedUserListViewController.swift
//
//
//  Created by Kihyun Lee on 12/29/23.
//

import UIKit
import Combine
import Core
import Domain

final class BlockedUserListViewController: BaseViewController<BlockedUserListView>, HiddenTabBarViewController {

    // MARK: - Properties
    weak var coordinator: BlockedUserListCoordinator?
    private let viewModel: BlockedUserListViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    // MARK: - Init
    init(viewModel: BlockedUserListViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "차단 관리"
        setupBlockedUserListDataSource()
        viewModel.action(.fetchBlockedUserList)
    }
    
    private func setupBlockedUserListDataSource() {
        layoutView.blockedUserListCollectionView.delegate = self
        let dataSource = BlockedUserListViewModel.BlockedUserListDataSource.DataSource(
            collectionView: layoutView.blockedUserListCollectionView,
            cellProvider: { [weak self] collectionView, indexPath, item in
                guard let self else { return UICollectionViewCell() }
                let cell: BlockedUserListCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                cell.configure(with: item)
                cell.delegate = self
                return cell
            }
        )
        
        let diffableDataSource = BlockedUserListViewModel.BlockedUserListDataSource(dataSource: dataSource)
        viewModel.setupDataSource(diffableDataSource)
    }
}

extension BlockedUserListViewController: UICollectionViewDelegate {
    
}

extension BlockedUserListViewController: BlockedUserListCollectionViewCellDelegate {
    func unblockButtonDidClicked() {
        print("차단 해제 버튼 눌림!")
        // viewModel.action(.unblock)
    }
}
