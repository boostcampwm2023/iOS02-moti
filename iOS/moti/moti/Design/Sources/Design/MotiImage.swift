//
//  MotiImage.swift
//
//
//  Created by 유정주 on 11/12/23.
//

import UIKit

/// Motimate 팀이 제작한 이미지
public enum MotiImage {
    /// 샘플 이미지 1
    #if DEBUG
    public static let sample1 = UIImage(resource: .sample1)
    public static let sample2 = UIImage(resource: .sample2)
    public static let sample3 = UIImage(resource: .sample3)
    public static let sample4 = UIImage(resource: .sample4)
    public static let sample5 = UIImage(resource: .sample5)
    public static let sample6 = UIImage(resource: .sample6)
    public static let sample7 = UIImage(resource: .sample7)
    #endif
    
    /// 흰색 moti 로고
    public static let logoWhite = UIImage(resource: .motiLogoWhite)
    
    /// 파란색 moti 로고
    public static let logoBlue = UIImage(resource: .motiLogoBlue)
    
    /// Cell 스켈레톤 이미지
    public static let skeleton = UIImage(resource: .skeleton)
    
    /// Cell 작은 스켈레톤 이미지
    public static let smallSkeleton = UIImage(resource: .smallSkeleton)
    
    /// 앱 아이콘 이미지 1024x1024
    public static let appIcon = UIImage(resource: .appIcon)
}
