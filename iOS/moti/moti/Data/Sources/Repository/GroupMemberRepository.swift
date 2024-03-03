//
//  GroupMemberRepository.swift
//
//
//  Created by Kihyun Lee on 12/5/23.
//

import Foundation
import Domain

public struct GroupMemberRepository: GroupMemberRepositoryProtocol {

    private let provider: ProviderProtocol
    public let groupId: Int
    
    public init(provider: ProviderProtocol = Provider(), groupId: Int) {
        self.provider = provider
        self.groupId = groupId
    }
    
    public func fetchGroupMemberList() async throws -> [GroupMember] {
        let endpoint = MotiAPI.fetchGroupMemberList(groupId: groupId)
        let responseDTO = try await provider.request(with: endpoint, type: FetchGroupMemberListResponseDTO.self)
        guard let groupMemberListDTO = responseDTO.data?.data else { throw NetworkError.decode }
        
        return groupMemberListDTO.map { GroupMember(dto: $0) }
    }
    
    public func updateGrade(userCode: String, requestValue: UpdateGradeRequestValue) async throws -> Bool {
        let endpoint = MotiAPI.updateGrade(groupId: groupId, userCode: userCode, requestValue: requestValue)
        
        let responseDTO = try await provider.request(with: endpoint, type: UpdateGradeResponseDTO.self)
        guard let isSuccess = responseDTO.success else { throw NetworkError.decode }
        
        return isSuccess
    }
    
    public func invite(requestValue: InviteMemberRequestValue) async throws -> Bool {
        let endpoint = MotiAPI.invite(requestValue: requestValue, groupId: groupId)
        
        do {
            let responseDTO = try await provider.request(with: endpoint, type: InviteMemberDTO.self)
            return responseDTO.success ?? false
        } catch NetworkError.statusCode(let statusCode, let message) {
            // status code에 따라 에러 메시지 세부화 시도
            if (400..<500) ~= statusCode {
                // 이미 초대된 그룹원입니다 등..
                throw NetworkError.custom(message: message)
            } else {
                throw NetworkError.custom(message: "서버 오류입니다.")
            }
        } catch {
            throw error
        }
    }
}
