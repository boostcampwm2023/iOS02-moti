//
//  GroupListViewController.swift
//  
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Core
import Design

final class GroupListViewController: BaseViewController<GroupListView> {

    // MARK: - Properties
    weak var coordinator: GroupListCoordinator?
    private let viewModel: GroupListViewModel
    
    // MARK: - Init
    init(viewModel: GroupListViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

}

// MARK: - Setup
private extension GroupListViewController {
    func setupUI() {
        setupNavigationBar()
    }
    
    func setupNavigationBar() {
        let logoItem = UIImageView(image: MotiImage.logoBlue)
        logoItem.contentMode = .scaleAspectFit
        let leftItem = UIBarButtonItem(customView: logoItem)
        leftItem.customView?.atl
            .width(constant: 60)
        navigationItem.leftBarButtonItem = leftItem

        // 오른쪽 프로필 버튼
        let profileImage = UIImage(
            systemName: "person.crop.circle.fill",
            withConfiguration: UIImage.SymbolConfiguration(font: .large)
        )
        let profileButton = UIButton(type: .system)
        profileButton.setImage(profileImage, for: .normal)
        profileButton.contentMode = .scaleAspectFit
        profileButton.tintColor = .primaryDarkGray
        let profileItem = UIBarButtonItem(customView: profileButton)

        // 오른쪽 더보기 버튼
        let editGroupItem = UIBarButtonItem(
            title: "편집", style: .plain, target: self,
            action: nil
        )
        
        let createGroupItem = UIBarButtonItem(
            title: "생성", style: .plain, target: self,
            action: nil
        )

        navigationItem.rightBarButtonItems = [profileItem, createGroupItem, editGroupItem]
    }
}
