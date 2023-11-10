//
//  BaseViewController.swift
//  
//
//  Created by Kihyun Lee on 11/9/23.
//

import UIKit

class BaseViewController<LayoutView: UIView>: UIViewController {
    var layoutView = LayoutView()
    
    override func loadView() {
        view = layoutView
    }
}
