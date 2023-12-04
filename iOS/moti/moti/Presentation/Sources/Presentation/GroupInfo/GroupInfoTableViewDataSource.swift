//
//  GroupInfoTableViewDataSource.swift
//
//
//  Created by Kihyun Lee on 12/4/23.
//

import UIKit

final class GroupInfoTableViewDataSource: NSObject, UITableViewDataSource {
    private var sectionHeaders = ["그룹"]
    private var cellTexts = [["그룹원", "탈퇴"]]
    
    // MARK: Methods
    func appendLeaderSection() {
        sectionHeaders.append("관리")
        cellTexts.append(["그룹원 관리"])
    }
    
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
        guard let cell = tableView.dequeueReusableCell(
            withIdentifier: GroupInfoTableViewCell.identifier) as? GroupInfoTableViewCell else {
            return UITableViewCell()
        }
        cell.configure(with: cellTexts[indexPath.section][indexPath.row])
        return cell
    }
}
