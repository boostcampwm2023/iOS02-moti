//
//  VibrationViewController.swift
//
//
//  Created by 유정주 on 12/7/23.
//

import UIKit
import AVFoundation

enum Vibration {
    case soft
    case heavy
    case selection
}

protocol VibrationViewController: UIViewController {
    func vibration(_ type: Vibration)
}

extension VibrationViewController {
    func vibration(_ type: Vibration) {
        switch type {
        case .soft:
            UIImpactFeedbackGenerator(style: .soft).impactOccurred()
        case .heavy:
            UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        case .selection:
            UISelectionFeedbackGenerator().selectionChanged()
        }
    }
}
