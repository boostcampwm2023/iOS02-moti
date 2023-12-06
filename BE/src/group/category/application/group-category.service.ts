import { Injectable } from '@nestjs/common';
import { GroupCategoryRepository } from '../entities/group-category.repository';
import { Transactional } from '../../../config/transaction-manager';
import { User } from '../../../users/domain/user.domain';
import { GroupCategoryCreate } from '../dto/group-category-create';
import { GroupRepository } from '../../group/entities/group.repository';
import { UnauthorizedGroupCategoryException } from '../exception/unauthorized-group-category.exception';
import { GroupCategory } from '../domain/group.category';
import { UnauthorizedApproachGroupCategoryException } from '../exception/unauthorized-approach-group-category.exception';

@Injectable()
export class GroupCategoryService {
  constructor(
    private readonly groupCategoryRepository: GroupCategoryRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  @Transactional()
  async createGroupCategory(
    user: User,
    groupId: number,
    groupCtgCreate: GroupCategoryCreate,
  ): Promise<GroupCategory> {
    const group = await this.getGroupByLeader(user, groupId);
    const groupCategory = groupCtgCreate.toModel(user, group);
    return this.groupCategoryRepository.saveGroupCategory(groupCategory);
  }

  @Transactional({ readonly: true })
  async retrieveCategoryMetadata(user: User, groupId: number) {
    const group = await this.getGroup(user, groupId);
    return this.groupCategoryRepository.findGroupCategoriesByUser(user, group);
  }

  private async getGroupByLeader(user: User, groupId: number) {
    const group = await this.groupRepository.findGroupByIdAndLeaderUser(
      user,
      groupId,
    );
    if (!group) throw new UnauthorizedGroupCategoryException();

    return group;
  }

  private async getGroup(user: User, groupId: number) {
    const group = await this.groupRepository.findByIdAndUser(groupId, user);
    if (!group) throw new UnauthorizedApproachGroupCategoryException();

    return group;
  }
}
