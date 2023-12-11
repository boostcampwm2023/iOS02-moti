//
//  AutoLayoutWrapper+UIView.swift
//
//
//  Created by 유정주 on 11/9/23.
//

import UIKit

// 업데이트 생각해보기
// MARK: - Default Autolayout
extension AutoLayoutWrapper {
    @discardableResult
    func width(
        equalTo anchor: NSLayoutAnchor<NSLayoutDimension>? = nil,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        if let anchor {
            view.widthAnchor.constraint(equalTo: anchor, constant: constant).isActive = true
        } else {
            view.widthAnchor.constraint(equalToConstant: constant).isActive = true
        }
        return self
    }
    
    @discardableResult
    func height(
        equalTo anchor: NSLayoutAnchor<NSLayoutDimension>? = nil,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        if let anchor {
            view.heightAnchor.constraint(equalTo: anchor, constant: constant).isActive = true
        } else {
            view.heightAnchor.constraint(equalToConstant: constant).isActive = true
        }
        return self
    }
    
    @discardableResult
    func centerX(
        equalTo anchor: NSLayoutAnchor<NSLayoutXAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.centerXAnchor.constraint(equalTo: anchor, constant: constant).isActive = true
        return self
    }
    
    @discardableResult
    func centerY(
        equalTo anchor: NSLayoutAnchor<NSLayoutYAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.centerYAnchor.constraint(equalTo: anchor, constant: constant).isActive = true
        return self
    }
    
    @discardableResult
    func centerY(
        greaterThanOrEqualTo anchor: NSLayoutAnchor<NSLayoutYAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.centerYAnchor.constraint(greaterThanOrEqualTo: anchor, constant: constant).isActive = true
        return self
    }
    
    @discardableResult
    func top(
        equalTo anchor: NSLayoutAnchor<NSLayoutYAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.topAnchor.constraint(equalTo: anchor, constant: constant).isActive = true
        return self
    }
    
    @discardableResult
    func bottom(
        equalTo anchor: NSLayoutAnchor<NSLayoutYAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.bottomAnchor.constraint(equalTo: anchor, constant: constant).isActive = true
        return self
    }
    
    @discardableResult
    func top(
        greaterThanOrEqualTo anchor: NSLayoutAnchor<NSLayoutYAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.topAnchor.constraint(greaterThanOrEqualTo: anchor, constant: constant).isActive = true
        return self
    }
    
    @discardableResult
    func bottom(
        greaterThanOrEqualTo anchor: NSLayoutAnchor<NSLayoutYAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.bottomAnchor.constraint(greaterThanOrEqualTo: anchor, constant: constant).isActive = true
        return self
    }
    
    @discardableResult
    func top(
        lessThanOrEqualTo anchor: NSLayoutAnchor<NSLayoutYAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.topAnchor.constraint(lessThanOrEqualTo: anchor, constant: constant).isActive = true
        return self
    }
    
    @discardableResult
    func bottom(
        lessThanOrEqualTo anchor: NSLayoutAnchor<NSLayoutYAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.bottomAnchor.constraint(lessThanOrEqualTo: anchor, constant: constant).isActive = true
        return self
    }
    
    @discardableResult
    func left(
        equalTo anchor: NSLayoutAnchor<NSLayoutXAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.leftAnchor.constraint(equalTo: anchor, constant: constant).isActive = true
        return self
    }
    
    @discardableResult
    func right(
        equalTo anchor: NSLayoutAnchor<NSLayoutXAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.rightAnchor.constraint(equalTo: anchor, constant: constant).isActive = true
        return self
    }
}

// MARK: - Custom Autolayout
extension AutoLayoutWrapper {
    @discardableResult
    func size(
        width: CGFloat,
        height: CGFloat
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.widthAnchor.constraint(equalToConstant: width).isActive = true
        view.heightAnchor.constraint(equalToConstant: height).isActive = true
        return self
    }
    
    // MARK: View
    @discardableResult
    func center(
        of basedView: UIView
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.centerXAnchor.constraint(equalTo: basedView.centerXAnchor).isActive = true
        view.centerYAnchor.constraint(equalTo: basedView.centerYAnchor).isActive = true
        return self
    }
    
    @discardableResult
    func vertical(
        equalTo basedView: UIView,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.topAnchor.constraint(equalTo: basedView.topAnchor, constant: constant).isActive = true
        view.bottomAnchor.constraint(equalTo: basedView.bottomAnchor, constant: -constant).isActive = true
        return self
    }
    
    @discardableResult
    func horizontal(
        equalTo basedView: UIView,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.leftAnchor.constraint(equalTo: basedView.leftAnchor, constant: constant).isActive = true
        view.rightAnchor.constraint(equalTo: basedView.rightAnchor, constant: -constant).isActive = true
        return self
    }
    
    @discardableResult
    func all(
        of basedView: UIView,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.topAnchor.constraint(equalTo: basedView.topAnchor, constant: constant).isActive = true
        view.bottomAnchor.constraint(equalTo: basedView.bottomAnchor, constant: -constant).isActive = true
        view.leftAnchor.constraint(equalTo: basedView.leftAnchor, constant: constant).isActive = true
        view.rightAnchor.constraint(equalTo: basedView.rightAnchor, constant: -constant).isActive = true
        return self
    }
    
    // MARK: Safe Area
    @discardableResult
    func center(
        of safeAreaGuide: UILayoutGuide
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.centerXAnchor.constraint(equalTo: safeAreaGuide.centerXAnchor).isActive = true
        view.centerYAnchor.constraint(equalTo: safeAreaGuide.centerYAnchor).isActive = true
        return self
    }
    
    @discardableResult
    func vertical(
        equalTo safeAreaGuide: UILayoutGuide,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.topAnchor.constraint(equalTo: safeAreaGuide.topAnchor, constant: constant).isActive = true
        view.bottomAnchor.constraint(equalTo: safeAreaGuide.bottomAnchor, constant: -constant).isActive = true
        return self
    }
    
    @discardableResult
    func horizontal(
        equalTo safeAreaGuide: UILayoutGuide,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.leftAnchor.constraint(equalTo: safeAreaGuide.leftAnchor, constant: constant).isActive = true
        view.rightAnchor.constraint(equalTo: safeAreaGuide.rightAnchor, constant: -constant).isActive = true
        return self
    }
    
    @discardableResult
    func all(
        equalTo safeAreaGuide: UILayoutGuide,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.topAnchor.constraint(equalTo: safeAreaGuide.topAnchor, constant: constant).isActive = true
        view.bottomAnchor.constraint(equalTo: safeAreaGuide.bottomAnchor, constant: -constant).isActive = true
        view.leftAnchor.constraint(equalTo: safeAreaGuide.leftAnchor, constant: constant).isActive = true
        view.rightAnchor.constraint(equalTo: safeAreaGuide.rightAnchor, constant: -constant).isActive = true
        return self
    }
}
