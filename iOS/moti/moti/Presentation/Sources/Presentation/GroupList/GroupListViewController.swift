//
//  GroupListViewController.swift
//  
//
//  Created by 유정주 on 11/14/23.
//

import UIKit
import Core

class GroupListViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        Logger.debug("Grouplist: " + #function)
    }

}
