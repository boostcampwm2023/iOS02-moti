// The Swift Programming Language
// https://docs.swift.org/swift-book

import UIKit
import Jeongfisher

// Jeong주 & Ki현 이미지 캐시
final class JKImageCache {

    public static let shared = JKImageCache()
    private init() { }
    
    // MARK: - Properties
    public typealias ImageCacheItem = JFCacheItem<Data>

    let memoryCache: JFMemoryCache<ImageCacheItem> = .init(capacity: .MB(100))
    let diskCache: JFDiskCache<ImageCacheItem> = .init(capacity: .GB(1), cacheFolderName: "JKImageCache")
    
    // MARK: - Methods
    // URL로 이미지를 얻는 메서드
    // 메모리 캐시 검사 -> 디스크 캐시 검사 -> 네트워크 다운로드
    func fetchImageData(
        from url: URL,
        imageType: JKImageType,
        imageViewSize: CGSize,
        downsamplingScale: CGFloat
    ) async -> Data? {
        let key = url.absoluteString + "-" + imageType.key
        // 메모리 캐시 검사
        // 원본은 메모리 캐시에 저장하지 않음 -> 검사하지 않아도 됨
        if case .thumbnail = imageType,
           let memoryCacheData = memoryCache.getData(key: key) {
            return memoryCacheData.data
        }
        
        // 디스크 캐시 검사
        if let diskCacheData = diskCache.getData(key: key) {
            // 썸네일만 메모리 캐시에 저장
            if case .thumbnail = imageType {
                try? memoryCache.saveCache(key: key, data: diskCacheData)
            }
            
            return diskCacheData.data
        }
        
        guard let networkData = await downloadImage(from: url) else { return nil }

        // 썸네일 타입은 다운샘플링 이미지를 메모리 캐시에 저장
        if imageType == .thumbnail,
           let downsampledImage = networkData.downsampling(to: imageViewSize, scale: downsamplingScale),
           let downsampledData = downsampledImage.jpegData(compressionQuality: 1.0) {
            let cacheItem = JKImageCache.ImageCacheItem(data: downsampledData, size: .Byte(downsampledData.count))
            try? JKImageCache.shared.memoryCache.saveCache(key: key, data: cacheItem)
        }

        // 원본 이미지를 디스크 캐시에 저장
        let cacheItem = JKImageCache.ImageCacheItem(data: networkData, size: .Byte(networkData.count))
        try? JKImageCache.shared.diskCache.saveCache(key: key, data: cacheItem)
        
        return networkData
    }
    
    // 네트워크 다운로드
    private func downloadImage(from url: URL) async -> Data? {
        return try? await JFImageDownloader.shared.downloadImage(from: url).data
    }
}
