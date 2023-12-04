//
//  GroupDetailAchievementViewController.swift
//  
//
//  Created by 유정주 on 12/3/23.
//

import UIKit
import Design

final class GroupDetailAchievementViewController: BaseViewController<GroupDetailAchievementView> {

    // MARK: - Properties
    private let viewModel: GroupDetailAchievementViewModel
    weak var coordinator: GroupDetailAchievementCoordinator?
    
    // MARK: - Init
    init(viewModel: GroupDetailAchievementViewModel) {
        self.viewModel = viewModel
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError()
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNavigationBar()
        layoutView.configure(achievement: viewModel.achievement)
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
    
    // MARK: - Setup
    func setupNavigationBar() {
        // 오른쪽 더보기 버튼
        let moreItem = UIBarButtonItem(
            image: SymbolImage.ellipsisCircle,
            style: .done,
            target: self,
            action: nil
        )
        
        // 작성자 본인에게만 표시
        let editAction = UIAction(title: "수정", handler: { _ in
            
        })
        // 작성자 본인, 관리자, 그룹장에게 표시
        let deleteAction = UIAction(title: "삭제", attributes: .destructive, handler: { _ in
            
        })
        // 작성자가 아닌 유저에게만 표시
        let blockingAchievementAction = UIAction(title: "도전기록 차단", attributes: .destructive, handler: { _ in
            
        })
        // 작성자가 아닌 유저에게만 표시
        let blockingUserAction = UIAction(title: "사용자 차단", attributes: .destructive, handler: { _ in
            
        })
        moreItem.menu = UIMenu(children: [
            editAction, deleteAction,
            blockingAchievementAction, blockingUserAction
        ])
        
        navigationItem.rightBarButtonItems = [moreItem]
    }

}
