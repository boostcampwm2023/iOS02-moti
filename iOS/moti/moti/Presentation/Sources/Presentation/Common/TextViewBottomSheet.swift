//
//  InputTextViewController.swift
//  
//
//  Created by 유정주 on 11/20/23.
//

import UIKit
import Combine

final class TextViewBottomSheet: UIViewController {

    private let textView = {
        let textView = UITextView()
        textView.font = .medium
        return textView
    }()
    
    private var isPlaceHolder = true
    private let placeholder = "(선택) 도전 성공한 소감이 어떠신가요?\n소감을 기록해 보세요!"
    
    var text: String {
        return isPlaceHolder ? "" : textView.text
    }
    
    // MARK: - Init
    init(text: String? = nil) {
        super.init(nibName: nil, bundle: nil)
        if let text {
            showText(text)
        } else {
            showPlaceholder()
        }
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        
        textView.delegate = self
        
        view.backgroundColor = textView.backgroundColor
        view.addSubview(textView)
        textView.atl
            .top(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 40)
            .bottom(equalTo: view.safeAreaLayoutGuide.bottomAnchor)
            .horizontal(equalTo: view.safeAreaLayoutGuide, constant: 20)
    }
    
    // MARK: - Methods
    func update(body: String) {
        if body.isEmpty {
            showPlaceholder()
        } else {
            showText(body)
        }
    }
    
    private func showPlaceholder() {
        isPlaceHolder = true
        textView.text = placeholder
        textView.textColor = .placeholderText
    }
    
    private func hidePlaceholder() {
        isPlaceHolder = false
        textView.text = ""
        textView.textColor = .label
    }
    
    private func showText(_ text: String) {
        hidePlaceholder()
        textView.text = text
    }
}

extension TextViewBottomSheet: UITextViewDelegate {
    func textViewDidBeginEditing(_ textView: UITextView) {
        if isPlaceHolder {
            hidePlaceholder()
        }
    }
    
    func textViewDidEndEditing(_ textView: UITextView) {
        if textView.text.isEmpty {
            showPlaceholder()
        }
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
