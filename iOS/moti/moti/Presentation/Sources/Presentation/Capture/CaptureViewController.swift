//
//  CaptureViewController.swift
//  
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Core

class CaptureViewController: UIViewController {

    // MARK: - Properties
    weak var coordinator: CaptureCoordinator?
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        coordinator?.finish()
    }
}
