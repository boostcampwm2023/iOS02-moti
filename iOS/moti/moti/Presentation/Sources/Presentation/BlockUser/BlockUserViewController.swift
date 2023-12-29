//
//  BlockUserViewController.swift
//
//
//  Created by Kihyun Lee on 12/29/23.
//

import UIKit
import Combine
import Core
import Domain

final class BlockUserViewController: BaseViewController<BlockUserView>, HiddenTabBarViewController {

    // MARK: - Properties
    weak var coordinator: BlockUserCoordinator?
    private let viewModel: BlockUserViewModel
    private var cancellables: Set<AnyCancellable> = []
    
    // MARK: - Init
    init(viewModel: BlockUserViewModel) {
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
        setupBlockUserDataSource()
        viewModel.action(.fetchBlockedUserList)
    }
    
    private func setupBlockUserDataSource() {
        layoutView.blockUserCollectionView.delegate = self
        let dataSource = BlockUserViewModel.BlockUserDataSource.DataSource(
            collectionView: layoutView.blockUserCollectionView,
            cellProvider: { [weak self] collectionView, indexPath, item in
                guard let self else { return UICollectionViewCell() }
                let cell: BlockUserCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                cell.configure(with: item)
                cell.delegate = self
                return cell
            }
        )
        
        let diffableDataSource = BlockUserViewModel.BlockUserDataSource(dataSource: dataSource)
        viewModel.setupDataSource(diffableDataSource)
    }
}

extension BlockUserViewController: UICollectionViewDelegate {
    
}

extension BlockUserViewController: BlockUserCollectionViewCellDelegate {
    func unblockButtonDidClicked() {
        print("차단 해제 버튼 눌림!")
        // viewModel.action(.unblock)
    }
}
