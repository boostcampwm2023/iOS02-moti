//
//  BaseViewController.swift
//  
//
//  Created by Kihyun Lee on 11/9/23.
//

import UIKit
import Design

class BaseViewController<LayoutView: UIView>: UIViewController {
    var layoutView = LayoutView()
    
    override func loadView() {
        if layoutView.backgroundColor == nil {
            layoutView.backgroundColor = .motiBackground
        }
        view = layoutView
    }
}
