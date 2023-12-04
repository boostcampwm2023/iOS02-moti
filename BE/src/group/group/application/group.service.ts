import { Injectable } from '@nestjs/common';
import { GroupRepository } from '../entities/group.repository';
import { CreateGroupRequest } from '../dto/create-group-request.dto';
import { User } from '../../../users/domain/user.domain';
import { UserGroupGrade } from '../domain/user-group-grade';
import { Transactional } from '../../../config/transaction-manager';
import { GroupResponse } from '../dto/group-response.dto';
import { GroupListResponse } from '../dto/group-list-response';
import { GroupAvatarHolder } from './group-avatar.holder';
import { UserGroupRepository } from '../entities/user-group.repository';
import { GroupLeaveResponse } from '../dto/group-leave-response.dto';
import { LeaderNotAllowedToLeaveException } from '../exception/leader-not-allowed-to-leave.exception';
import { NoSuchUserGroupException } from '../exception/no-such-user-group.exception';
import { InviteGroupRequest } from '../dto/invite-group-request.dto';
import { UserRepository } from '../../../users/entities/user.repository';
import { InviteGroupResponse } from '../dto/invite-group-response';
import { UserGroup } from '../domain/user-group.doamin';
import { InvitePermissionDeniedException } from '../exception/invite-permission-denied.exception';
import { DuplicatedInviteException } from '../exception/duplicated-invite.exception';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly userGroupRepository: UserGroupRepository,
    private readonly groupAvatarHolder: GroupAvatarHolder,
  ) {}

  @Transactional()
  async create(user: User, createGroupRequest: CreateGroupRequest) {
    const group = createGroupRequest.toModel();
    group.addMember(user, UserGroupGrade.LEADER);
    if (!group.avatarUrl)
      group.assignAvatarUrl(this.groupAvatarHolder.getUrl());
    return GroupResponse.from(await this.groupRepository.saveGroup(group));
  }

  @Transactional({ readonly: true })
  async getGroups(userId: number) {
    const groups = await this.groupRepository.findByUserId(userId);
    return new GroupListResponse(groups);
  }

  @Transactional()
  async removeUser(userId: number, groupId: number) {
    const userGroup = await this.getUserGroup(userId, groupId);
    if (!userGroup) throw new NoSuchUserGroupException();
    if (userGroup.grade === UserGroupGrade.LEADER)
      throw new LeaderNotAllowedToLeaveException();

    await this.userGroupRepository.repository.softDelete(userGroup);
    return new GroupLeaveResponse(userId, groupId);
  }

  @Transactional()
  async invite(
    user: User,
    groupId: number,
    inviteGroupRequest: InviteGroupRequest,
  ) {
    const userGroup = await this.getUserGroup(user.id, groupId);

    this.checkValidInvite(userGroup);
    await this.checkDuplicatedInvite(inviteGroupRequest.userCode, groupId);

    const group = await this.groupRepository.findById(groupId);
    const invited = await this.userRepository.findOneByUserCode(
      inviteGroupRequest.userCode,
    );

    const saved = await this.userGroupRepository.saveUserGroup(
      new UserGroup(invited, group, UserGroupGrade.PARTICIPANT),
    );

    return new InviteGroupResponse(saved.group.id, invited.userCode);
  }

  private async getUserGroup(userId: number, groupId: number) {
    return await this.userGroupRepository.findOneByUserIdAndGroupId(
      userId,
      groupId,
    );
  }

  private async checkDuplicatedInvite(userCode: string, groupId: number) {
    const userGroup =
      await this.userGroupRepository.findOneByUserCodeAndGroupId(
        userCode,
        groupId,
      );
    if (userGroup) throw new DuplicatedInviteException();
  }

  private checkValidInvite(userGroup: UserGroup) {
    if (!userGroup) throw new NoSuchUserGroupException();
    if (
      userGroup.grade !== UserGroupGrade.LEADER &&
      userGroup.grade !== UserGroupGrade.MANAGER
    )
      throw new InvitePermissionDeniedException();
  }
}
