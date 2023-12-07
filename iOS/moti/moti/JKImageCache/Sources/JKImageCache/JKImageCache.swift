// The Swift Programming Language
// https://docs.swift.org/swift-book

import UIKit
import Jeongfisher

// URL로 이미지를 요청하는 메서드

enum JKImageType {
    case thumbnail(size: Int)
    case original
    
    var key: String {
        switch self {
        case .thumbnail: return "th"
        case .original: return "or"
        }
    }
}

final class JKImageCache {
    public static let shared = JKImageCache()
    private init() { }
    
    // MARK: - Properties
    public typealias ImageCacheItem = JFCacheItem<Data>

    private let memoryCache: JFMemoryCache<ImageCacheItem> = .init(capacity: .MB(100))
    private let diskCache: JFDiskCache<ImageCacheItem> = .init(capacity: .GB(1))
    
    // MARK: - Methods
    // URL로 이미지를 얻는 메서드
    // 메모리 캐시 검사 -> 디스크 캐시 검사 -> 네트워크 다운로드
    func fetchImage(from url: URL, imageType: JKImageType = .thumbnail(size: 200)) async -> UIImage? {
        let key = url.absoluteString + "-" + imageType.key
        // 메모리 캐시 검사
        // 원본은 메모리 캐시에 저장하지 않음 -> 검사하지 않아도 됨
        if case .thumbnail(_) = imageType,
           let memoryCacheData = memoryCache.getData(key: key) {
            return memoryCacheData.data.convertToImage()
        }
        
        // 디스크 캐시 검사
        if let diskCacheData = diskCache.getData(key: key) {
            // 썸네일만 메모리 캐시에 저장
            if case .thumbnail(_) = imageType {
                try? memoryCache.saveCache(key: key, data: diskCacheData)
            }
            return diskCacheData.data.convertToImage()
        }
        
        // 네트워크 검사
        let networkImage = await downloadImage(from: url)
        let networkImageData = networkImage?.jpegData(compressionQuality: 1.0)
        
        // 썸네일 이미지만 메모리 캐시에 저장
        if case .thumbnail(let size) = imageType,
           let downsampledImage = networkImageData?.downsampling(to: .init(width: size, height: size), scale: 1.5),
           let downsampledData = downsampledImage.jpegData(compressionQuality: 1.0) {
            let cacheItem = ImageCacheItem(data: downsampledData, size: .Byte(downsampledData.count))
            try? memoryCache.saveCache(key: key, data: cacheItem)
        }
        
        // 원본 이미지를 디스크 캐시에 저장
        if let networkImageData {
            let cacheItem = ImageCacheItem(data: networkImageData, size: .Byte(networkImageData.count))
            try? diskCache.saveCache(key: key, data: cacheItem)
        }
        
        return networkImage
    }
    
    // 네트워크 다운로드
    private func downloadImage(from url: URL) async -> UIImage? {
        return await JFImageDownloader.shared.fetchImage(from: url)
    }
}
