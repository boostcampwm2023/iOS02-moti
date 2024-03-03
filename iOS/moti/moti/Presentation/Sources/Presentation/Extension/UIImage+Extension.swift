//
//  UIImage+Extension.swift
//
//
//  Created by 유정주 on 11/21/23.
//

import UIKit
import Core

extension UIImage {

    /// 이미지를 정사각형으로 Crop하는 메서드
    func cropToSquare() -> UIImage? {
        guard let upImage = self.fixedOrientation(),
              let image = upImage.cgImage else { return nil }
        #if DEBUG
        Logger.debug("원본 이미지 사이즈: (\(image.width), \(image.height))")
        #endif
        
        let cropSize = min(image.width, image.height)
        let centerX = (image.width - cropSize) / 2
        let centerY = (image.height - cropSize) / 2
        
        let cropRect = CGRect(x: centerX, y: centerY, width: cropSize, height: cropSize)
        guard let croppedCGImage = image.cropping(to: cropRect) else { return nil }
        
        #if DEBUG
        Logger.debug("Cropped 이미지 사이즈: (\(croppedCGImage.width), \(croppedCGImage.height))")
        #endif
        
        return UIImage(cgImage: croppedCGImage)
    }
    
    // https://gist.github.com/schickling/b5d86cb070130f80bb40?permalink_comment_id=3500925#gistcomment-3500925
    /// 이미지의 방향을 up으로 고정하는 메서드
    func fixedOrientation() -> UIImage? {
        guard imageOrientation != .up else { return self }
        
        var transform: CGAffineTransform = .identity
        switch imageOrientation {
        case .down, .downMirrored:
            transform = transform.translatedBy(x: size.width, y: size.height)
            transform = transform.rotated(by: CGFloat.pi)
        case .left, .leftMirrored:
            transform = transform.translatedBy(x: size.width, y: 0)
            transform = transform.rotated(by: CGFloat.pi / 2.0)
        case .right, .rightMirrored:
            transform = transform.translatedBy(x: 0, y: size.height)
            transform = transform.rotated(by: CGFloat.pi / -2.0)
        case .up, .upMirrored:
            break
        @unknown default:
            break
        }
        
        // Flip image one more time if needed to, this is to prevent flipped image
        switch imageOrientation {
        case .upMirrored, .downMirrored:
            transform = transform.translatedBy(x: size.width, y: 0)
            transform = transform.scaledBy(x: -1, y: 1)
        case .leftMirrored, .rightMirrored:
            transform = transform.translatedBy(x: size.height, y: 0)
            transform = transform.scaledBy(x: -1, y: 1)
        case .up, .down, .left, .right:
            break
        @unknown default:
            break
        }
        
        guard var cgImage = self.cgImage else { return nil }
        
        autoreleasepool {
            guard let colorSpace = cgImage.colorSpace else { return }
            
            guard let context = CGContext(
                data: nil,
                width: Int(self.size.width),
                height: Int(self.size.height),
                bitsPerComponent: cgImage.bitsPerComponent,
                bytesPerRow: 0, 
                space: colorSpace,
                bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
            ) else { return }
            
            context.concatenate(transform)
            
            var drawRect: CGRect = .zero
            switch imageOrientation {
            case .left, .leftMirrored, .right, .rightMirrored:
                drawRect.size = CGSize(width: size.height, height: size.width)
            default:
                drawRect.size = CGSize(width: size.width, height: size.height)
            }
            
            context.draw(cgImage, in: drawRect)
            
            guard let newCGImage = context.makeImage() else {
                return
            }
            cgImage = newCGImage
        }
        
        let uiImage = UIImage(cgImage: cgImage, scale: 1, orientation: .up)
        return uiImage
    }
}
