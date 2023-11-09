//
//  BaseViewController.swift
//  
//
//  Created by Kihyun Lee on 11/9/23.
//

import UIKit

open class BaseViewController<LayoutView: UIView>: UIViewController {
    open var layoutView = LayoutView()
    
    open override func loadView() {
        view = layoutView
    }
}
