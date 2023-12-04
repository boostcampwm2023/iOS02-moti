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
        EmojiImage.fire.cgImage,
        EmojiImage.like.cgImage,
        EmojiImage.party.cgImage,
        EmojiImage.smile.cgImage,
        EmojiImage.star.cgImage,
        MotiImage.logoBlue.cgImage
    ]
    private var velocities = [200, 300, 400]
    
    // MARK: - Views
    private lazy var label = {
        let label = UILabel()
        label.font = .xlargeBold
        label.numberOfLines = 0
        label.text = "\(achievement.title)\n성공을 축하합니다!"
        label.textAlignment = .center
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
        view.backgroundColor = .motiBackground
        view.alpha = 0.5
        
        setUpEmitterLayer()
        setUpTapGestureRecognizer()
        
        view.addSubview(label)
        label.atl
            .center(of: view)
    }
    
    // MARK: - Setup
    private func setUpEmitterLayer() {
        emitterLayer.emitterSize = CGSize(width: view.bounds.width, height: 2)
        emitterLayer.emitterShape = .line
        emitterLayer.emitterPosition = CGPoint(x: view.bounds.width / 2, y: -10)
        
        // layer에 뿌려질 셀
        emitterLayer.emitterCells = (0..<10).map { _ in makeEmitterCell() }
        
        // 레이어 얹어주면 방출 시작되는 것 보임
        view.layer.addSublayer(emitterLayer)
    }
    
    private func setUpTapGestureRecognizer() {
        let tap = UITapGestureRecognizer(target: self, action: #selector(handleTap))
        view.addGestureRecognizer(tap)
        view.isUserInteractionEnabled = true
    }
    
    // MARK: - Actions
    @objc private func handleTap() {
        
    }
    
    private func makeEmitterCell() -> CAEmitterCell {
        let cell = CAEmitterCell()
        
        if let emoji = emojiImages.randomElement() {
            cell.contents = emoji
            if emoji == MotiImage.logoBlue.cgImage {
                // 크기의 scale 값. 기본은 1.0. 0.1로 하면 0.1배로 보여줌
                cell.scale = 0.1
            } else {
                cell.scale = 0.2
            }
        }
        // 1초에 생성하는 셀 개수
        cell.birthRate = 3
        // 셀을 유지하는 시간(n초)
        cell.lifetime = 5
        // lifetime의 범위 (1로 하면 2~4가 됨. 3 +- 1)
        cell.lifetimeRange = 1
        // scale의 범위
        cell.scaleRange = 0.1
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
