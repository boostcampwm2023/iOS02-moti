//
//  AppInfoViewController.swift
//  
//
//  Created by 유정주 on 12/2/23.
//

import UIKit
import Domain

final class AppInfoViewController: BaseViewController<AppInfoView> {

    // MARK: - Properties
    weak var coordinator: AppInfoCoordinator?
    private let version: Version
    
    // MARK: - Init
    init(version: Version) {
        self.version = version
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()

    }
}
