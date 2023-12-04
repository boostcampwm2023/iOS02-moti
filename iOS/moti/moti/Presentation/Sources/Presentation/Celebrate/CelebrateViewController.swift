//
//  CelebrateViewController.swift
//  
//
//  Created by 유정주 on 12/4/23.
//

import UIKit
import Design
import Domain

final class CelebrateViewController: UIViewController {
    
    // MARK: - Properties
    private let achievement: Achievement
    private let emitterLayer = CAEmitterLayer()
    private let emojiImages: [CGImage?] = [
        EmojiImage.party.cgImage,
        EmojiImage.party.cgImage,
        EmojiImage.fire.cgImage,
        MotiImage.logoBlue.cgImage,
        MotiImage.logoWhite.cgImage
    ]
    private var velocities = [200, 300, 400]
    
    // MARK: - Views
    private let backgroundView = {
        let view = UIView()
        view.backgroundColor = .black
        view.alpha = 0.5
        return view
    }()
    private let closeButton = {
        let button = UIButton(type: .system)
        button.setImage(UIImage(systemName: "xmark.circle.fill"), for: .normal)
        button.tintColor = .white
        return button
    }()
    private lazy var titleLabel = {
        let label = UILabel()
        label.font = .xlargeBold
        label.numberOfLines = 0
        label.textAlignment = .center
        label.textColor = .white
        return label
    }()
    private lazy var guideLabel = {
        let label = UILabel()
        label.text = "화면을 터치하면 사라집니다."
        label.font = .mediumBold
        label.numberOfLines = 0
        label.textAlignment = .center
        label.textColor = .white
        return label
    }()
    
    // MARK: - Init
    init(achievement: Achievement) {
        self.achievement = achievement
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setUpEmitterLayer()
        setUpTapGestureRecognizer()
        
        view.addSubview(backgroundView)
        backgroundView.atl
            .all(of: view)
        setupCloseButton()
        setupLabels()
    }
    
    // MARK: - Setup
    private func setUpEmitterLayer() {
        emitterLayer.emitterSize = CGSize(width: view.bounds.width, height: 2)
        emitterLayer.emitterShape = .line
        emitterLayer.emitterPosition = CGPoint(x: view.bounds.width / 2, y: -10)
        
        // layer에 뿌려질 셀
        emitterLayer.emitterCells = (0..<emojiImages.count).map { makeEmitterCell(index: $0) }
        
        // 레이어 얹어주면 방출 시작되는 것 보임
        view.layer.addSublayer(emitterLayer)
    }
    
    private func setUpTapGestureRecognizer() {
        let tap = UITapGestureRecognizer(target: self, action: #selector(handleTap))
        view.addGestureRecognizer(tap)
        view.isUserInteractionEnabled = true
    }
    
    private func setupLabels() {
        titleLabel.text = "축하합니다!\n\"\(achievement.title)\"\n성공"
        view.addSubview(titleLabel)
        titleLabel.atl
            .centerY(equalTo: view.safeAreaLayoutGuide.centerYAnchor)
            .horizontal(equalTo: view.safeAreaLayoutGuide, constant: 40)
        
        view.addSubview(guideLabel)
        guideLabel.atl
            .centerX(equalTo: view.safeAreaLayoutGuide.centerXAnchor)
            .top(equalTo: titleLabel.bottomAnchor, constant: 40)
    }
    
    private func setupCloseButton() {
        closeButton.addTarget(self, action: #selector(handleTap), for: .touchUpInside)
        view.addSubview(closeButton)
        closeButton.atl
            .size(width: 60, height: 60)
            .top(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20)
            .right(equalTo: view.safeAreaLayoutGuide.rightAnchor, constant: -20)
    }
    
    // MARK: - Actions
    @objc private func handleTap() {
        UIView.animate(withDuration: 0.2, animations: {
            self.view.alpha = 0
        }, completion: { _ in
            self.dismiss(animated: false)
        })
    }
    
    private func makeEmitterCell(index: Int) -> CAEmitterCell {
        let cell = CAEmitterCell()
        
        let emoji = emojiImages[index]
        cell.contents = emoji
        if emoji == MotiImage.logoBlue.cgImage || 
            emoji == MotiImage.logoWhite.cgImage {
            // 크기의 scale 값. 기본은 1.0. 0.1로 하면 0.1배로 보여줌
            cell.scale = 0.1
        } else {
            cell.scale = 0.2
        }
        cell.scaleRange = 0.05
        // 1초에 생성하는 셀 개수
        cell.birthRate = 3
        // 셀을 유지하는 시간(n초)
        cell.lifetime = 5
        // scale의 범위
        // 수치가 높을수록 빠르게 더 멀리 방출됨
        if let random = velocities.randomElement() {
            cell.velocity = CGFloat(random)
        }
        // 방출 각도의 경도 방향 (방위각)
        cell.emissionLongitude = CGFloat.pi
        // particle이 방출되는 각도. 0이면 linear하게 방출
        cell.emissionRange = 0.5
        
        // 회전하는 속도. 0이면 회전하지 않음
        cell.spin = 2
        // spin 범위
        cell.spinRange = 0.5
        
        return cell
    }
}
