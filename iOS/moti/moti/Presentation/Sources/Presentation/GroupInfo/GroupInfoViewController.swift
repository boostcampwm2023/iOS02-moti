//
//  GroupInfoViewController.swift
//
//
//  Created by Kihyun Lee on 12/4/23.
//

import UIKit
import Design
import Domain

final class GroupInfoViewController: BaseViewController<GroupInfoView> {

    // MARK: - Properties
    weak var coordinator: GroupInfoCoordinator?
    private let group: Group
    var sectionHeaders = ["그룹"]
    var cellTexts = [["그룹원", "탈퇴"]]
    
    // MARK: - Init
    init(group: Group) {
        self.group = group
        if group.grade == .leader {
            sectionHeaders.append("관리")
            cellTexts.append(["그룹원 관리"])
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
        layoutView.tableView.dataSource = self
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
    
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        layoutView.cancelDownloadImage()
    }
}

extension GroupInfoViewController: UITableViewDelegate {
    
}

extension GroupInfoViewController: UITableViewDataSource {
    // MARK: - Section
    func numberOfSections(in tableView: UITableView) -> Int {
        return sectionHeaders.count
    }

    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return sectionHeaders[section]
    }
    
    // MARK: - Row
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return cellTexts[section].count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = layoutView.tableView.dequeueReusableCell(
            withIdentifier: GroupInfoTableViewCell.identifier) as? GroupInfoTableViewCell else {
            return UITableViewCell()
        }
        cell.configure(with: cellTexts[indexPath.section][indexPath.row])
        return cell
    }
}
