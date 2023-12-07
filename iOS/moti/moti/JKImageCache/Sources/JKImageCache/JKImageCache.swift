// The Swift Programming Language
// https://docs.swift.org/swift-book

import UIKit
import Jeongfisher

final class JKImageCache {
    public static let shared = JKImageCache()
    private init() { }
    
    // MARK: - Properties
    public typealias ImageCacheItem = JFCacheItem<Data>

    let memoryCache: JFMemoryCache<ImageCacheItem> = .init(capacity: .MB(100))
    let diskCache: JFDiskCache<ImageCacheItem> = .init(capacity: .GB(1))
    
    // MARK: - Methods
    // URL로 이미지를 얻는 메서드
    // 메모리 캐시 검사 -> 디스크 캐시 검사 -> 네트워크 다운로드
    func fetchImageData(from url: URL, imageType: JKImageType) async -> Data? {
        let key = url.absoluteString + "-" + imageType.key
        // 메모리 캐시 검사
        // 원본은 메모리 캐시에 저장하지 않음 -> 검사하지 않아도 됨
        if imageType == .thumbnail,
           let memoryCacheData = memoryCache.getData(key: key) {
            return memoryCacheData.data
        }
        
        // 디스크 캐시 검사
        if let diskCacheData = diskCache.getData(key: key) {
            // 썸네일만 메모리 캐시에 저장
            if imageType == .thumbnail {
                try? memoryCache.saveCache(key: key, data: diskCacheData)
            }
            return diskCacheData.data
        }
        
        return await downloadImage(from: url)
    }
    
    // 네트워크 다운로드
    private func downloadImage(from url: URL) async -> Data? {
        return try? await JFImageDownloader.shared.downloadImage(from: url).data
    }
}
