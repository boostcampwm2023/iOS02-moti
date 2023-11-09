//
//  File.swift
//  
//
//  Created by 유정주 on 11/9/23.
//

import UIKit

// MARK: - Default Autolayout
public extension AutoLayoutWrapper {
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
public extension AutoLayoutWrapper {
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
