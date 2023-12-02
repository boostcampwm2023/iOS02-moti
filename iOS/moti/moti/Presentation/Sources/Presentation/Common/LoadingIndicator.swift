//
//  LoadingIndicator.swift
//
//
//  Created by 유정주 on 12/2/23.
//

import UIKit

protocol LoadingIndicator: UIViewController {
    func showLoadingIndicator()
    func hideLoadingIndicator()
}

extension LoadingIndicator {
    func showLoadingIndicator() {
        DispatchQueue.main.async {
            let loadingIndicatorView: UIActivityIndicatorView
            loadingIndicatorView = UIActivityIndicatorView(style: .medium)
            loadingIndicatorView.frame = self.view.frame //다른 UI가 눌리지 않도록
            loadingIndicatorView.color = .primaryBlue
            self.view.addSubview(loadingIndicatorView)

            loadingIndicatorView.startAnimating()
        }
    }

    func hideLoadingIndicator() {
        DispatchQueue.main.async {
            self.view.subviews.filter {
                $0 is UIActivityIndicatorView
            }.forEach {
                $0.removeFromSuperview()
            }
        }
    }
}
