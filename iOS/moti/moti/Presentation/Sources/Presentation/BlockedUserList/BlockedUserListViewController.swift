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

final class BlockedUserListViewController: BaseViewController<BlockedUserListView>, LoadingIndicator, HiddenTabBarViewController {

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
        bind()
        setupBlockedUserListDataSource()
        viewModel.action(.fetchBlockedUserList)
    }
    
    private func bind() {
        viewModel.fetchBlockedUserListState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                case .success:
                    hideLoadingIndicator()
                case .failed:
                    hideLoadingIndicator()
                    showErrorAlert(message: "차단한 사용자 리스트를 불러오는 데에 실패했습니다.")
                }
            }
            .store(in: &cancellables)
        
        viewModel.unblockUserState
            .receive(on: RunLoop.main)
            .sink { [weak self] state in
                guard let self else { return }
                switch state {
                case .loading:
                    showLoadingIndicator()
                case .success:
                    hideLoadingIndicator()
                case .failed:
                    hideLoadingIndicator()
                    showErrorAlert(message: "사용자 차단 해제에 실패했습니다.")
                }
            }
            .store(in: &cancellables)
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
    func collectionView(_ collectionView: UICollectionView, didEndDisplaying cell: UICollectionViewCell, forItemAt indexPath: IndexPath) {
        guard let cell = cell as? BlockedUserListCollectionViewCell else { return }
        cell.cancelDownloadImage()
    }
}

extension BlockedUserListViewController: BlockedUserListCollectionViewCellDelegate {
    func unblockButtonDidClicked(userCode: String) {
        showTwoButtonAlert(title: "정말 차단 해제하시겠습니까?", okTitle: "차단 해제", okAction: {
            self.viewModel.action(.unblockUser(userCode: userCode))
        })
    }
}
