//
//  HomeViewController.swift
//  
//
//  Created by 유정주 on 11/13/23.
//

import UIKit
import Core

class HomeViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        self.view.backgroundColor = .motiBackground
        // Do any additional setup after loading the view.
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        Logger.debug("Home " + #function)
    }

}
