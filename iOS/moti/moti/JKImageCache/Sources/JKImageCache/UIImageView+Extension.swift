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
    /// - Parameters:
    ///   - url: 이미지 URL
    ///   - placeHolder: 다운로드 지연 시 보여줄 placeHolder 이미지
    ///   - waitPlaceHolderTime: placeHolder 대기 시간
    ///   - options: 적용할 JFOption들
    public func setImage(
        with url: URL,
        imageType: JKImageType = .thumbnail,
        placeHolder: UIImage? = nil,
        waitPlaceHolderTime: TimeInterval = 1.0,
        downsamplingScale: CGFloat = 1.0
    ) {
        var mutableSelf = self
        mutableSelf.downloadUrl = url.absoluteString

        Task {
            // placeholder 타이머
            var timer: Timer?
            if placeHolder != nil {
                timer = createPlaceHolderTimer(placeHolder, waitTime: waitPlaceHolderTime)
                timer?.fire()
            }
            defer { timer?.invalidate() }

            let key = url.absoluteString + "-" + imageType.key

            let imageData = await JKImageCache.shared.fetchImageData(from: url, imageType: imageType)
            let downsampledImage = await imageData?
                .downsampling(to: base.frame.size, scale: downsamplingScale)
            
            // 썸네일 이미지만 메모리 캐시에 저장
            if imageType == .thumbnail,
               let downsampledData = downsampledImage?.jpegData(compressionQuality: 1.0) {
                let cacheItem = JKImageCache.ImageCacheItem(data: downsampledData, size: .Byte(downsampledData.count))
                try? JKImageCache.shared.memoryCache.saveCache(key: key, data: cacheItem)
            }
    
            // 원본 이미지를 디스크 캐시에 저장
            if let imageData {
                let cacheItem = JKImageCache.ImageCacheItem(data: imageData, size: .Byte(imageData.count))
                try? JKImageCache.shared.diskCache.saveCache(key: key, data: cacheItem)
            }
            
            updateImage(downsampledImage)
        }
    }
    
    /// URL을 이용해 원본 이미지 설정
    /// - Parameters:
    ///   - url: 이미지 URL
    ///   - placeHolder: 다운로드 지연 시 보여줄 placeHolder 이미지
    ///   - waitPlaceHolderTime: placeHolder 대기 시간
    ///   - options: 적용할 JFOption들
    public func setOriginalImage(
        with url: URL,
        placeHolder: UIImage? = nil,
        waitPlaceHolderTime: TimeInterval = 1.0,
        options: Set<JFOption> = [.showOriginalImage])
    {
        setImage(with: url,
                 placeHolder: placeHolder,
                 waitPlaceHolderTime: waitPlaceHolderTime)
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
