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
import { NoSuchUserGroupException } from '../exception/no-such-user-group.exception';
import { InviteGroupRequest } from '../dto/invite-group-request.dto';
import { UserRepository } from '../../../users/entities/user.repository';
import { InviteGroupResponse } from '../dto/invite-group-response';
import { UserGroup } from '../domain/user-group.doamin';
import { InvitePermissionDeniedException } from '../exception/invite-permission-denied.exception';
import { DuplicatedInviteException } from '../exception/duplicated-invite.exception';
import { GroupUserListResponse } from '../dto/group-user-list-response';
import { AssignGradeRequest } from '../dto/assign-grade-request.dto';
import { AssignGradeResponse } from '../dto/assign-grade-response.dto';
import { OnlyLeaderAllowedAssignGradeException } from '../exception/only-leader-allowed-assign-grade.exception';
import { NoSucGroupException } from '../exception/no-such-group.exception';
import { JoinGroupRequest } from '../dto/join-group-request.dto';
import { JoinGroupResponse } from '../dto/join-group-response.dto';
import { DuplicatedJoinException } from '../exception/duplicated-join.exception';
import { GroupCodeGenerator } from './group-code-generator';
import { GroupRelocateRequest } from '../dto/group-relocate-request';
import { InvalidGroupRelocateException } from '../exception/Invalid-Group-Relocate.exception';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly userGroupRepository: UserGroupRepository,
    private readonly groupAvatarHolder: GroupAvatarHolder,
    private readonly groupCodeGenerator: GroupCodeGenerator,
  ) {}

  @Transactional()
  async create(user: User, createGroupRequest: CreateGroupRequest) {
    const group = createGroupRequest.toModel();
    group.addMember(user, UserGroupGrade.LEADER);
    if (!group.avatarUrl)
      group.assignAvatarUrl(this.groupAvatarHolder.getUrl());
    const groupCode = await this.groupCodeGenerator.generate();
    group.assignGroupCode(groupCode);

    await this.userRepository.updateUser(user);
    return GroupResponse.from(await this.groupRepository.saveGroup(group));
  }

  @Transactional({ readonly: true })
  async getGroups(userId: number) {
    const groups = await this.groupRepository.findByUserId(userId);
    return new GroupListResponse(groups);
  }

  @Transactional()
  async removeUser(user: User, groupId: number) {
    const userGroup = await this.getUserGroup(user.id, groupId);

    if (await this.isLastMember(groupId, user.id)) {
      await this.groupRepository.repository.delete(groupId);
      return new GroupLeaveResponse(user.id, groupId);
    }

    if (userGroup.grade === UserGroupGrade.LEADER) {
      await this.assignNextLeader(groupId, user.id);
    }
    user.leaveGroup();
    await this.userRepository.updateUser(user);
    await this.userGroupRepository.repository.softDelete(userGroup);

    return new GroupLeaveResponse(user.id, groupId);
  }

  @Transactional()
  async removeUserFromAllGroup(user: User) {
    const userGroups = await this.userGroupRepository.findAllByUserId(user.id);
    for (const userGroup of userGroups) {
      await this.removeUser(user, userGroup.group.id);
    }
  }

  @Transactional()
  async invite(
    user: User,
    groupId: number,
    inviteGroupRequest: InviteGroupRequest,
  ) {
    const userGroup = await this.getUserGroup(user.id, groupId);

    this.checkPermission(userGroup);
    await this.checkDuplicatedInvite(inviteGroupRequest.userCode, groupId);

    const group = await this.groupRepository.findById(groupId);
    const invited = await this.userRepository.findOneByUserCode(
      inviteGroupRequest.userCode,
    );

    await this.userGroupRepository.saveUserGroup(invited.joinGroup(group));
    await this.userRepository.updateUser(invited);

    return new InviteGroupResponse(group.id, invited.userCode);
  }

  @Transactional({ readonly: true })
  async getGroupUsers(user: User, groupId: number) {
    await this.getUserGroup(user.id, groupId);
    return new GroupUserListResponse(
      await this.userRepository.findByGroupId(groupId),
    );
  }

  @Transactional()
  async updateGroupGrade(
    user: User,
    groupId: number,
    targetUserCode: string,
    assignGradeRequest: AssignGradeRequest,
  ) {
    const requester = await this.getUserGroup(user.id, groupId);
    if (requester.grade !== UserGroupGrade.LEADER)
      throw new OnlyLeaderAllowedAssignGradeException();
    const userGroup =
      await this.userGroupRepository.findOneByUserCodeAndGroupId(
        targetUserCode,
        groupId,
      );
    userGroup.changeGrade(assignGradeRequest.grade);
    return AssignGradeResponse.from(
      await this.userGroupRepository.saveUserGroup(userGroup),
    );
  }
  @Transactional()
  async join(user: User, joinGroupRequest: JoinGroupRequest) {
    const group = await this.groupRepository.findByGroupCode(
      joinGroupRequest.groupCode,
    );
    if (!group) throw new NoSucGroupException();
    await this.checkDuplicatedJoin(user.userCode, group.id);

    const saved = await this.userGroupRepository.saveUserGroup(
      user.joinGroup(group),
    );

    return new JoinGroupResponse(saved.group.groupCode, saved.user.userCode);
  }

  @Transactional()
  async relocatedGroup(
    user: User,
    groupRelocatedRequest: GroupRelocateRequest,
  ) {
    if (user.groupCount != groupRelocatedRequest.getGroupCount())
      throw new InvalidGroupRelocateException();

    const groups = await this.userGroupRepository.findAllByIdAndUser(
      user.id,
      groupRelocatedRequest.order,
    );

    for (let index = 0; index < groups.length; index++) {
      const userGroup = groups[index];
      userGroup.seq = index + 1;
      await this.userGroupRepository.saveUserGroup(userGroup);
    }
  }

  private async getUserGroup(userId: number, groupId: number) {
    const userGroup = await this.userGroupRepository.findOneByUserIdAndGroupId(
      userId,
      groupId,
    );
    if (!userGroup) throw new NoSuchUserGroupException();
    return userGroup;
  }

  private async checkDuplicatedInvite(userCode: string, groupId: number) {
    const userGroup =
      await this.userGroupRepository.findOneByUserCodeAndGroupId(
        userCode,
        groupId,
      );
    if (userGroup) throw new DuplicatedInviteException();
  }

  private async checkDuplicatedJoin(userCode: string, groupId: number) {
    const userGroup =
      await this.userGroupRepository.findOneByUserCodeAndGroupId(
        userCode,
        groupId,
      );
    if (userGroup) throw new DuplicatedJoinException();
  }

  private checkPermission(userGroup: UserGroup) {
    if (
      userGroup.grade !== UserGroupGrade.LEADER &&
      userGroup.grade !== UserGroupGrade.MANAGER
    )
      throw new InvitePermissionDeniedException();
  }

  private async assignNextLeader(groupId: number, userId: number) {
    const members =
      await this.userGroupRepository.findAllByGroupIdAndUserIdNotOrderByCreatedAtAsc(
        groupId,
        userId,
      );
    if (members) {
      const nextLeader = members[0];
      nextLeader.grade = UserGroupGrade.LEADER;
      await this.userGroupRepository.repository.update(
        nextLeader.id,
        nextLeader,
      );
    }
  }

  private async isLastMember(groupId: number, userId: number) {
    return (
      (await this.userGroupRepository.findCountByGroupIdAndUserIdNot(
        groupId,
        userId,
      )) === 0
    );
  }
}
