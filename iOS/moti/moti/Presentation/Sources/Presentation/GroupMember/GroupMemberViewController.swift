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
    private let manageMode: Bool
    
    // MARK: - Init
    init(viewModel: GroupMemberViewModel, manageMode: Bool) {
        self.viewModel = viewModel
        self.manageMode = manageMode
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        title = manageMode ? "그룹원 관리" : "그룹원"
        setupGroupMemberDataSource()
        
        bind()
        viewModel.action(.launch)
    }
    
    private func setupGroupMemberDataSource() {
        layoutView.groupMemberCollectionView.delegate = self
        let dataSource = GroupMemberViewModel.GroupMemberDataSource.DataSource(
            collectionView: layoutView.groupMemberCollectionView,
            cellProvider: { [weak self] collectionView, indexPath, item in
                guard let self else { return UICollectionViewCell() }
                let cell: GroupMemberCollectionViewCell = collectionView.dequeueReusableCell(for: indexPath)
                if self.manageMode {
                    cell.configureForLeader(with: item)
                } else {
                    cell.configureForMember(with: item)
                }
                cell.delegate = self
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

extension GroupMemberViewController: GroupMemberCollectionViewCellDelegate {
    func menuDidClicked(completionHandler: @escaping () -> Void) {
        showTwoButtonAlert(title: "권한을 수정하시겠습니까?", okTitle: "수정") {
            print("viewModel - 권한 수정 action 후..?")
            completionHandler()
        }
    }
}
