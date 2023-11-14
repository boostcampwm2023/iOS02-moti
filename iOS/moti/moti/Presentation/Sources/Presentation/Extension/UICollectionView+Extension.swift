//
//  UICollectionView+Extension.swift
//
//
//  Created by Kihyun Lee on 11/14/23.
//

import UIKit

extension UICollectionView {
    func register(with type: UICollectionViewCell.Type) {
        register(type, forCellWithReuseIdentifier: type.identifier)
    }
    
    func register(with type: UICollectionReusableView.Type, elementKind: String) {
        register(type, forSupplementaryViewOfKind: elementKind, withReuseIdentifier: type.identifier)
    }
    
    func dequeueReusableCell<T: UICollectionViewCell>(for indexPath: IndexPath) -> T {
        guard let cell = dequeueReusableCell(withReuseIdentifier: T.identifier, for: indexPath) as? T else {
            return .init() // TODO: Default Cell 설정
        }
        return cell
    }
}
