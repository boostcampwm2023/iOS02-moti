//
//  CaptureButton.swift
//  
//
//  Created by 유정주 on 11/16/23.
//

import UIKit

/// 동그란 촬영 버튼.
/// 기본 크기를 원한다면 defaultSize를 사용하세요.
public final class CaptureButton: UIButton {
    public static let defaultSize: CGFloat = 75
    
    // MARK: - Views
    private let circleView = UIView()
    
    // MARK: - Properties
    private let animationDuration = 0.2
    
    // MARK: - Init
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        setupUI()
        addTarget()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
    }
    
    private func addTarget() {
        addTarget(self, action: #selector(captureButtonTouchDown), for: .touchDown)
        addTarget(self, action: #selector(captureButtonTouchUpInside), for: .touchUpInside)
        addTarget(self, action: #selector(captureButtonTouchUpOutside), for: .touchUpOutside)
    }
    
    public override func layoutSubviews() {
        super.layoutSubviews()
        
        let size = min(frame.width, frame.height)
        applyCorenrRadius(size: size)
    }
    
    // MARK: - Setup
    private func setupUI() {
        backgroundColor = .motiBackground
        layer.borderColor = UIColor.primaryBlue.cgColor
        layer.borderWidth = 6
        
        setupCircleView()
    }
    
    private func setupCircleView() {
        circleView.translatesAutoresizingMaskIntoConstraints = false
        circleView.isUserInteractionEnabled = false
        
        circleView.backgroundColor = .primaryBlue
        
        addSubview(circleView)
        // 중앙 정렬
        NSLayoutConstraint.activate([
            circleView.centerXAnchor.constraint(equalTo: centerXAnchor),
            circleView.centerYAnchor.constraint(equalTo: centerYAnchor)
        ])
    }
    
    // 원으로 만드는 메서드
    private func applyCorenrRadius(size: CGFloat) {
        layer.cornerRadius = size / 2
        circleView.layer.cornerRadius = (size * 0.78) / 2
        NSLayoutConstraint.activate([
            circleView.widthAnchor.constraint(equalToConstant: (size * 0.78)),
            circleView.heightAnchor.constraint(equalToConstant: (size * 0.78))
        ])
    }

    // MARK: - Actions
    @objc private func captureButtonTouchDown() {
        UIView.animate(withDuration: animationDuration) {
            let scale = CGAffineTransform(scaleX: 0.9, y: 0.9)
            self.circleView.transform = scale
        }
    }
    
    @objc private func captureButtonTouchUpInside() {
        UIView.animate(withDuration: animationDuration) {
            self.circleView.transform = .identity
        }
    }
    
    @objc private func captureButtonTouchUpOutside() {
        UIView.animate(withDuration: animationDuration) {
            self.circleView.transform = .identity
        }
    }
}
