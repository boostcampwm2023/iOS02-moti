//
//  GroupInfoViewController.swift
//
//
//  Created by Kihyun Lee on 12/4/23.
//

import UIKit
import Design
import Domain

protocol GroupInfoViewControllerDelegate: AnyObject {
    func dropCellDidClicked(groupId: Int)
}

final class GroupInfoViewController: BaseViewController<GroupInfoView>, HiddenTabBarViewController {

    // MARK: - Properties
    weak var coordinator: GroupInfoCoordinator?
    weak var delegate: GroupInfoViewControllerDelegate?
    private let group: Group
    private let dataSource = GroupInfoTableViewDataSource()
    
    // MARK: - Init
    init(group: Group) {
        self.group = group
        if group.grade == .leader {
            dataSource.appendLeaderSection()
        }
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        
        title = "그룹 정보"
        layoutView.configure(group: group)
        layoutView.tableView.delegate = self
        layoutView.tableView.dataSource = dataSource
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        layoutView.cancelDownloadImage()
    }
}

extension GroupInfoViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if dataSource.isGroupMemberCell(indexPath: indexPath) {
            coordinator?.moveToGroupMemberViewController(group: group, manageMode: false)
        } else if dataSource.isLeaderCell(indexPath: indexPath) {
            coordinator?.moveToGroupMemberViewController(group: group, manageMode: true)
        } else if dataSource.isDropCell(indexPath: indexPath) {
            showDestructiveTwoButtonAlert(title: "그룹에서 탈퇴하시겠습니까?", okTitle: "탈퇴") { [weak self] in
                guard let self else { return }
                delegate?.dropCellDidClicked(groupId: group.id)
            }
        }
    }
}
