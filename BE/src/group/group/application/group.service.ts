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

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
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
    const userGroup = await this.userGroupRepository.findOneByUserIdAndGroupId(
      userId,
      groupId,
    );
    if (!userGroup) throw new NoSuchUserGroupException();
    if (userGroup.grade === UserGroupGrade.LEADER)
      throw new LeaderNotAllowedToLeaveException();

    await this.userGroupRepository.repository.softDelete(userGroup);
    return new GroupLeaveResponse(userId, groupId);
  }
}
