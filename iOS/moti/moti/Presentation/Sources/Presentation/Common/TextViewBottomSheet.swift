//
//  InputTextViewController.swift
//  
//
//  Created by 유정주 on 11/20/23.
//

import UIKit

final class TextViewBottomSheet: UIViewController {

    private let textView = {
        let textView = UITextView()
        textView.font = .medium
        return textView
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = textView.backgroundColor
        view.addSubview(textView)
        textView.atl
            .top(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 40)
            .bottom(equalTo: view.safeAreaLayoutGuide.bottomAnchor)
            .horizontal(equalTo: view.safeAreaLayoutGuide, constant: 20)
    }
}

extension UISheetPresentationController.Detent.Identifier {
    static let small = UISheetPresentationController.Detent.Identifier("small")
}

extension UISheetPresentationController.Detent {
    class func small() -> UISheetPresentationController.Detent {
        if #available(iOS 16.0, *) {
            return UISheetPresentationController.Detent.custom(identifier: .small) { 0.15 * $0.maximumDetentValue }
        } else {
            return .medium()
        }
    }
}
