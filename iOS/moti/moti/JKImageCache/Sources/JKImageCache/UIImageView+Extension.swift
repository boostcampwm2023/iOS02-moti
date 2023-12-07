//
//  UIImageView+Extension.swift
//
//
//  Created by 유정주 on 12/7/23.
//

import UIKit
import Jeongfisher

private struct JKAssociatedKeys {
    static var downloadUrl = "downloadUrl"
}

extension JKImageCacheWrapper where Base: UIImageView {
    
    /// UIImageView가 사용한 URL
    private var downloadUrl: String? {
        get { getAssociatedObject(base, &JKAssociatedKeys.downloadUrl) }
        set { setRetainedAssociatedObject(base, &JKAssociatedKeys.downloadUrl, newValue) }
    }
    
    /// URL을 이용해 Downsampling 이미지 설정
    public func setImage(
        with url: URL,
        imageType: JKImageType = .thumbnail,
        placeHolder: UIImage? = nil,
        waitPlaceHolderTime: TimeInterval = 1.0,
        downsamplingScale: CGFloat = 1.0
    ) {
        var mutableSelf = self
        mutableSelf.downloadUrl = url.absoluteString

        Task(priority: .background) {
            // placeholder 타이머
            var timer: Timer?
            if placeHolder != nil {
                timer = createPlaceHolderTimer(placeHolder, waitTime: waitPlaceHolderTime)
                timer?.fire()
            }
            defer { timer?.invalidate() }

            guard let imageData = await JKImageCache.shared.fetchImageData(
                from: url,
                imageType: imageType,
                imageViewSize: base.frame.size,
                downsamplingScale: downsamplingScale
            ) else {
                updateImage(nil)
                return
            }
            
            guard let downsampledImage = await imageData
                .downsampling(to: base.frame.size, scale: downsamplingScale) else {
                updateImage(imageData.convertToImage())
                return
            }

            updateImage(downsampledImage)
        }
    }
    
    /// main thread에서 UIImageView 이미지 업데이트
    /// - Parameter image: UIImageView에 넣을 UIImage
    private func updateImage(_ image: UIImage?) {
        DispatchQueue.main.async {
            self.base.image = image
        }
    }
    
    /// 진행 중인 다운로드 취소
    public func cancelDownloadImage() {
        guard let downloadUrlString = downloadUrl,
              let url = URL(string: downloadUrlString) else { return }
        
        Task(priority: .background) {
            await JFImageDownloader.shared.cancelDownloadImage(url: url)
        }
    }
}

private extension JKImageCacheWrapper where Base: UIImageView {
    /// PlaceHolder를 보여주는 타이머 생성.
    /// 스크롤 도중에도 PlaceHolder를 보여줘야 하므로 DispatchQueue 사용
    /// - Parameters:
    ///   - placeHolder: 보여줄 PlaceHolder 이미지
    ///   - waitTime: Place Holder 대기 시간
    /// - Returns: Timer 반환
    func createPlaceHolderTimer(_ placeHolder: UIImage?, waitTime: TimeInterval) -> Timer? {
        guard let placeHolder = placeHolder else { return nil }
        
        let timer = Timer.scheduledTimer(withTimeInterval: waitTime, repeats: true) { _ in
            showPlaceHolder(image: placeHolder)
        }
        
        return timer
    }
    
    func showPlaceHolder(image: UIImage) {
        DispatchQueue.main.async {
            self.base.image = image
        }
    }
}

private extension JKImageCacheWrapper {
    func getAssociatedObject<T>(_ object: Any, _ key: UnsafeRawPointer) -> T? {
        return objc_getAssociatedObject(object, key) as? T
    }

    func setRetainedAssociatedObject<T>(_ object: Any, _ key: UnsafeRawPointer, _ value: T) {
        objc_setAssociatedObject(object, key, value, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)
    }
}
