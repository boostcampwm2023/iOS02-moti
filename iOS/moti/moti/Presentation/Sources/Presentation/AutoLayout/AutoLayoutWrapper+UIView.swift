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
    
    @discardableResult
    func center(
        of parentView: UIView
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.centerXAnchor.constraint(equalTo: parentView.centerXAnchor).isActive = true
        view.centerYAnchor.constraint(equalTo: parentView.centerYAnchor).isActive = true
        return self
    }
    
    @discardableResult
    func vertical(
        equalTo anchor: NSLayoutAnchor<NSLayoutYAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.topAnchor.constraint(equalTo: anchor, constant: constant).isActive = true
        view.bottomAnchor.constraint(equalTo: anchor, constant: -constant).isActive = true
        return self
    }
    
    @discardableResult
    func horizontal(
        equalTo anchor: NSLayoutAnchor<NSLayoutXAxisAnchor>,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.leftAnchor.constraint(equalTo: anchor, constant: constant).isActive = true
        view.rightAnchor.constraint(equalTo: anchor, constant: -constant).isActive = true
        return self
    }
    
    @discardableResult
    func all(
        of parentView: UIView,
        constant: CGFloat = 0
    ) -> Self {
        view.translatesAutoresizingMaskIntoConstraints = false
        view.topAnchor.constraint(equalTo: parentView.topAnchor, constant: constant).isActive = true
        view.bottomAnchor.constraint(equalTo: parentView.bottomAnchor, constant: -constant).isActive = true
        view.leftAnchor.constraint(equalTo: parentView.leftAnchor, constant: constant).isActive = true
        view.rightAnchor.constraint(equalTo: parentView.rightAnchor, constant: -constant).isActive = true
        return self
    }
}
