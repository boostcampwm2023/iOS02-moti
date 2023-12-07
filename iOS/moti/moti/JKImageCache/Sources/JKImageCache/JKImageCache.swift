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
    func fetchImageData(from url: URL, imageType: JKImageType) async -> Data? {
        let key = url.absoluteString + "-" + imageType.key
        // 메모리 캐시 검사
        // 원본은 메모리 캐시에 저장하지 않음 -> 검사하지 않아도 됨
        if imageType == .thumbnail,
           let memoryCacheData = memoryCache.getData(key: key) {
            print("[JK] 메모리 캐시에서 GET")
            return memoryCacheData.data
        }
        
        // 디스크 캐시 검사
        if let diskCacheData = diskCache.getData(key: key) {
            print("[JK] 디스크 캐시에서 GET")
            // 썸네일만 메모리 캐시에 저장
            if imageType == .thumbnail {
                try? memoryCache.saveCache(key: key, data: diskCacheData)
            }
            
            return diskCacheData.data
        }
        
        guard let networkData = await downloadImage(from: url) else { return nil }
        
//        let cacheItem = ImageCacheItem(data: networkData, size: .Byte(networkData.count))
//        do {
//            try memoryCache.saveCache(key: key, data: cacheItem)
//            try diskCache.saveCache(key: key, data: cacheItem)
//        } catch {
//            print("[JK] 캐시 저장 에러: \(error)")
//        }
        
        print("[JK] 네트워크에서 GET")
        return networkData
    }
    
    // 네트워크 다운로드
    private func downloadImage(from url: URL) async -> Data? {
        do {
            let downloadData = try await JFImageDownloader.shared.downloadImage(from: url).data
            print("[JK] downloadData: \(downloadData)")
            return downloadData
        } catch {
            print("[JK] error: \(error.localizedDescription)")
            return nil
        }
    }
}
