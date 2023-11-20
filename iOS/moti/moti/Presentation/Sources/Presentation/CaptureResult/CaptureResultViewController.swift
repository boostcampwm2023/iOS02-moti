//
//  CaptureResultViewController.swift
//  
//
//  Created by 유정주 on 11/20/23.
//

import UIKit
import Core
import Design

final class CaptureResultViewController: BaseViewController<CaptureResultView> {

    // MARK: - Properties
    weak var coordinator: CaptureResultCoordinator?
    private let resultImageData: Data
    
    // MARK: - Init
    init(resultImageData: Data) {
        self.resultImageData = resultImageData
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Life Cycles
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if let resultImage = convertDataToImage(resultImageData) {
            layoutView.configure(image: resultImage, count: 10)
        } else {
            layoutView.configure(image: MotiImage.sample1, count: 10)
        }
    }
    
    private func convertDataToImage(_ data: Data) -> UIImage? {
        guard let image = UIImage(data: data) else { return nil }
        
        #if DEBUG
            Logger.debug("이미지 사이즈: \(image.size)")
            Logger.debug("이미지 용량: \(data) / \(data.count / 1000) KB\n")
        #endif
        return image
    }
    
    private func cropImage(image: UIImage, rect: CGRect) -> UIImage {
        guard let imageRef = image.cgImage?.cropping(to: rect) else {
            return image
        }
        
        let croppedImage = UIImage(cgImage: imageRef)
        return croppedImage
    }
}
