//
//  GroupMemberViewController.swift
//
//
//  Created by Kihyun Lee on 12/5/23.
//

import UIKit
import Combine
import Core
import Domain

final class GroupMemberViewController: BaseViewController<GroupMemberView>, HiddenTabBarViewController {

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
}

extension GroupMemberViewController: UICollectionViewDelegate { }

extension GroupMemberViewController: GroupMemberCollectionViewCellDelegate {

    func menuDidClicked(groupMember: GroupMember, newGroupGrade: GroupGrade) {
        showTwoButtonAlert(title: "\(newGroupGrade.description) 권한으로 수정하시겠습니까?", okTitle: "수정", okAction: {
            self.viewModel.action(.updateGrade(groupMember: groupMember, newGroupGrade: newGroupGrade))
        })
    }
}
