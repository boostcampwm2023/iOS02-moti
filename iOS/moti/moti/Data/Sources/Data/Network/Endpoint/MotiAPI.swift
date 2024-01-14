//
//  MotiAPI.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation
import Domain

enum MotiAPI: EndpointProtocol {
    // 공용
    case version
    case login(requestValue: LoginRequestValue)
    case autoLogin(requestValue: AutoLoginRequestValue)
    case revoke(requestValue: RevokeRequestValue)
    case saveImage(requestValue: SaveImageRequestValue)
    // 개인
    case fetchAchievementList(requestValue: FetchAchievementListRequestValue?)
    case fetchCategory(categoryId: Int)
    case fetchCategoryList
    case addCategory(requestValue: AddCategoryRequestValue)
    case reorderCategories(requestValue: ReorderCategoriesRequestValue)
    case fetchDetailAchievement(requestValue: FetchDetailAchievementRequestValue)
    case deleteAchievement(achievementId: Int)
    case updateAchievement(requestValue: UpdateAchievementRequestValue)
    case postAchievement(requestValue: PostAchievementRequestValue)
    case deleteCategory(categoryId: Int)
    // 그룹
    case fetchGroupList
    case createGroup(requestValue: CreateGroupRequestValue)
    case fetchGroupAchievementList(requestValue: FetchAchievementListRequestValue?, groupId: Int)
    case fetchGroupCategory(groupId: Int, categoryId: Int)
    case fetchGroupCategoryList(groupId: Int)
    case addGroupCategory(requestValue: AddCategoryRequestValue, groupId: Int)
    case fetchGroupDetailAchievement(requestValue: FetchDetailAchievementRequestValue, groupId: Int)
    case deleteGroupAchievement(achievementId: Int, groupId: Int)
    case updateGroupAchievement(requestValue: UpdateAchievementRequestValue, groupId: Int)
    case postGroupAchievement(requestValue: PostAchievementRequestValue, groupId: Int)
    case fetchGroupMemberList(groupId: Int)
    case updateGrade(groupId: Int, userCode: String, requestValue: UpdateGradeRequestValue)
    case invite(requestValue: InviteMemberRequestValue, groupId: Int)
    case dropGroup(groupId: Int)
    case joinGroup(requestValue: JoinGroupRequestValue)
    case reorderGroupCategories(groupId: Int, requestValue: ReorderCategoriesRequestValue)
    case deleteGroupCategory(groupId: Int, categoryId: Int)
    // 차단
    case blockingUser(userCode: String)
    case blockingAchievement(achievementId: Int, groupId: Int)
    case fetchBlockedUserList
    case unblockUser(userCode: String)
    // 이모지
    case fetchEmojis(achievementId: Int, groupId: Int)
    case toggleEmoji(achievementId: Int, groupId: Int, emojiId: String)

    private var keychainStorage: KeychainStorageProtocol {
        return KeychainStorage.shared
    }
}

extension MotiAPI {
    var version: String {
        return "v1"
    }
    
    var baseURL: String {
        return Bundle.main.object(forInfoDictionaryKey: "BASE_URL") as! String + "/api/\(version)"
    }
    
    var path: String {
        switch self {
        case .version: return "/operate/policy"
        case .login: return "/auth/login"
        case .autoLogin: return "/auth/refresh"
        case .revoke: return "/auth/revoke"
        // 개인
        case .fetchAchievementList: return "/achievements"
        case .fetchCategory(let categoryId): return "/categories/\(categoryId)"
        case .fetchCategoryList: return "/categories"
        case .addCategory: return "/categories"
        case .reorderCategories: return "/categories"
        case .fetchDetailAchievement(let requestValue): return "/achievements/\(requestValue.id)"
        case .saveImage: return "/images"
        case .deleteAchievement(let achievementId): return "/achievements/\(achievementId)"
        case .updateAchievement(let requestValue): return "/achievements/\(requestValue.id)"
        case .postAchievement: return "/achievements"
        case .deleteCategory(let categoryId):
            return "/categories/\(categoryId)"
        // 그룹
        case .fetchGroupList: return "/groups"
        case .createGroup: return "/groups"
        case .fetchGroupAchievementList(_, let groupId):
            return "/groups/\(groupId)/achievements"
        case .fetchGroupCategory(let groupId, let categoryId):
            return "/groups/\(groupId)/categories/\(categoryId)"
        case .fetchGroupCategoryList(let groupId):
            return "/groups/\(groupId)/categories"
        case .addGroupCategory(_, let groupId):
            return "/groups/\(groupId)/categories"
        case .fetchGroupDetailAchievement(let requestValue, let groupId):
            return "/groups/\(groupId)/achievements/\(requestValue.id)"
        case .deleteGroupAchievement(let achievementId, let groupId):
            return "/groups/\(groupId)/achievements/\(achievementId)"
        case .updateGroupAchievement(let requestValue, let groupId):
            return "/groups/\(groupId)/achievements/\(requestValue.id)"
        case .postGroupAchievement(_, let groupId):
            return "/groups/\(groupId)/achievements"
        case .fetchGroupMemberList(let groupId):
            return "/groups/\(groupId)/users"
        case .updateGrade(let groupId, let userCode, _):
            return "/groups/\(groupId)/users/\(userCode)/auth"
        case .blockingUser(let userCode):
            return "/users/\(userCode)/reject"
        case .blockingAchievement(let achievementId, let groupId):
            return "/groups/\(groupId)/achievements/\(achievementId)/reject"
        case .invite(_, let groupId):
            return "/groups/\(groupId)/users"
        case .fetchEmojis(let achievementId, let groupId):
            return "/groups/\(groupId)/achievements/\(achievementId)/emojis"
        case .toggleEmoji(let achievementId, let groupId, let emojiId):
            return "/groups/\(groupId)/achievements/\(achievementId)/emojis/\(emojiId)"
        case .dropGroup(let groupId):
            return "/groups/\(groupId)/participation"
        case .joinGroup:
            return "/groups/participation"
        case .reorderGroupCategories(let groupId, _):
            return "/groups/\(groupId)/categories"
        case .deleteGroupCategory(let groupId, let categoryId):
            return "/groups/\(groupId)/categories/\(categoryId)"
        case .fetchBlockedUserList:
            return "/users/reject"
        case .unblockUser(let userCode):
            return "/users/\(userCode)/reject"
        }
    }
    
    var method: HttpMethod {
        switch self {
        case .version: return .get
        case .login: return .post
        case .autoLogin: return .post
        case .revoke: return .delete
        // 개인
        case .fetchAchievementList: return .get
        case .fetchCategory: return .get
        case .fetchCategoryList: return .get
        case .addCategory: return .post
        case .reorderCategories: return .put
        case .fetchDetailAchievement: return .get
        case .saveImage: return .post
        case .deleteAchievement: return .delete
        case .updateAchievement: return .put
        case .postAchievement: return .post
        case .deleteCategory: return .delete
        // 그룹
        case .fetchGroupList: return .get
        case .createGroup: return .post
        case .fetchGroupAchievementList: return .get
        case .fetchGroupCategory: return .get
        case .fetchGroupCategoryList: return .get
        case .addGroupCategory: return .post
        case .fetchGroupDetailAchievement: return .get
        case .deleteGroupAchievement: return .delete
        case .updateGroupAchievement: return .put
        case .postGroupAchievement: return .post
        case .fetchGroupMemberList: return .get
        case .updateGrade: return .post
        case .blockingUser: return .post
        case .blockingAchievement: return .post
        case .invite: return .post
        case .fetchEmojis: return .get
        case .toggleEmoji: return .post
        case .dropGroup: return .delete
        case .joinGroup: return .post
        case .reorderGroupCategories: return .put
        case .deleteGroupCategory: return .delete
        case .fetchBlockedUserList: return .get
        case .unblockUser: return .delete
        }
    }
    
    var queryParameters: Encodable? {
        switch self {
        case .fetchAchievementList(let requestValue):
            return requestValue
        case .fetchGroupAchievementList(let requestValue, _):
            return requestValue
        default:
            return nil
        }
    }
    
    var bodyParameters: Encodable? {
        switch self {
        case .login(let requestValue):
            return requestValue
        case .autoLogin(let requestValue):
            return requestValue
        case .revoke(let requestValue):
            return requestValue
        case .addCategory(let requestValue):
            return requestValue
        case .reorderCategories(let requestValue):
            return requestValue
        case .updateAchievement(let requestValue):
            return requestValue.body
        case .postAchievement(let requestValue):
            return requestValue
        case .createGroup(let requestValue):
            return requestValue
        case .addGroupCategory(let requestValue, _):
            return requestValue
        case .updateGroupAchievement(let requestValue, _):
            return requestValue.body
        case .postGroupAchievement(let requestValue, _):
            return requestValue
        case .invite(let requestValue, _):
            return requestValue
        case .updateGrade(_, _, let requestValue):
            return requestValue
        case .joinGroup(let requestValue):
            return requestValue
        case .reorderGroupCategories(_, let requestValue):
            return requestValue
        default:
            return nil
        }
    }
    
    var headers: [String: String]? {
        var header: [String: String] = [:]
        
        // Content-Type
        switch self {
        case .saveImage(let requestValue):
            header["Content-Type"] = "multipart/form-data; boundary=\(requestValue.boundary)"
        default:
            header["Content-Type"] = "application/json"
        }
        
        // Authorization
        switch self {
        case .version, .login:
            break
        default:
            if let accessTokenData = keychainStorage.read(key: .accessToken),
               let accessToken = String(data: accessTokenData, encoding: .utf8) {
                header["Authorization"] = "Bearer \(accessToken)"
            }
        }
        
        return header
    }
}
