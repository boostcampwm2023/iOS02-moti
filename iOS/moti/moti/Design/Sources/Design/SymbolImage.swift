//
//  SymbolImage.swift
//
//
//  Created by 유정주 on 11/9/23.
//

import UIKit

/// moti 앱에서 쓰는 SFSymbol 이미지
public enum SymbolImage {
    /// 􀅼. 카테고리 추가에 사용됨
    public static let plus = UIImage(systemName: "plus")
    
    /// 􀍠. 옵션 더보기 버튼에 사용됨
    public static let ellipsis = UIImage(systemName: "ellipsis")
    
    /// 􀍡. 옵션 더보기 버튼에 사용됨
    public static let ellipsisCircle = UIImage(systemName: "ellipsis.circle")
    
    /// 􀉪. 개인 탭 아이템에 사용됨
    public static let individualTabItem = UIImage(systemName: "person.fill")
    
    /// 􀻸. 그룹 탭 아이템에 사용됨
    public static let groupTabItem = UIImage(systemName: "person.3.sequence.fill")
    
    /// 􀈄. 이미지 다운로드에 사용됨
    public static let download = UIImage(systemName: "square.and.arrow.down")
    
    /// 􀈟. 이미지 공유에 사용됨
    public static let share = UIImage(systemName: "paperplane")
    
    /// 􀏅. 앨범에서 선택 버튼에 사용됨
    public static let photo = UIImage(systemName: "photo")
    
    /// 􀟜. 전면 카메라로 촬영에 사용됨
    public static let iphone = UIImage(systemName: "iphone")
    
    /// 􀾖. 후면 카메라로 촬영에 사용됨
    public static let iphoneCamera = UIImage(systemName: "iphone.rear.camera")
    
    /// 􁄠. 공지사항 알림에 사용됨
    public static let bell = UIImage(systemName: "bell.and.waves.left.and.right.fill")
    
    /// 􀌟. 프로필 수정에 사용됨
    public static let camera = UIImage(systemName: "camera.fill")
    
    /// 􀰓. 공지사항 댓글  등록에 사용됨
    public static let sendMessage = UIImage(systemName: "arrow.forward.circle.fill")
    
    /// 􀆏. 그룹원 권한 수정 버튼에 사용됨
    public static let chevronUpDown = UIImage(systemName: "chevron.up.chevron.down")
}
