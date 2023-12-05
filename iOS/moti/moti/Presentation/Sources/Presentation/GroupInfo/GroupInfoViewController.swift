//
//  GroupInfoViewController.swift
//
//
//  Created by Kihyun Lee on 12/4/23.
//

import UIKit
import Design
import Domain

final class GroupInfoViewController: BaseViewController<GroupInfoView>, HiddenTabBarViewController {

    // MARK: - Properties
    weak var coordinator: GroupInfoCoordinator?
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
        if dataSource.isGroupMemberCell(indexPath: indexPath) {
            coordinator?.moveToGroupMemberViewController(group: group, manageMode: false)
        } else if dataSource.isLeaderCell(indexPath: indexPath) {
            coordinator?.moveToGroupMemberViewController(group: group, manageMode: true)
        }
    }
}
