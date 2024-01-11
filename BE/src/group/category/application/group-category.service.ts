import { Injectable } from '@nestjs/common';
import { GroupCategoryRepository } from '../entities/group-category.repository';
import { Transactional } from '../../../config/transaction-manager';
import { User } from '../../../users/domain/user.domain';
import { GroupCategoryCreate } from '../dto/group-category-create';
import { GroupRepository } from '../../group/entities/group.repository';
import { UnauthorizedGroupCategoryException } from '../exception/unauthorized-group-category.exception';
import { GroupCategory } from '../domain/group.category';
import { UnauthorizedApproachGroupCategoryException } from '../exception/unauthorized-approach-group-category.exception';
import { GroupCategoryRelocateRequest } from '../dto/group-category-relocate';
import { InvalidCategoryRelocateException } from '../../../category/exception/Invalid-Category-Relocate.exception';

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
    await this.groupRepository.saveGroup(group);
    return this.groupCategoryRepository.saveGroupCategory(groupCategory);
  }

  @Transactional({ readonly: true })
  async retrieveCategoryMetadata(user: User, groupId: number) {
    const group = await this.getGroup(user, groupId);
    return this.groupCategoryRepository.findGroupCategoriesByUser(user, group);
  }

  @Transactional({ readonly: true })
  async retrieveCategoryMetadataById(
    user: User,
    groupId: number,
    categoryId: number,
  ) {
    const group = await this.getGroup(user, groupId);
    const categoryMetaData =
      await this.groupCategoryRepository.findGroupCategory(group, categoryId);
    if (!categoryMetaData)
      throw new UnauthorizedApproachGroupCategoryException();

    return categoryMetaData;
  }

  @Transactional()
  async relocateCategory(
    user: User,
    groupId: number,
    categoryRelocateRequest: GroupCategoryRelocateRequest,
  ) {
    const group = await this.getGroup(user, groupId);
    if (group.categoryCount != categoryRelocateRequest.getCategoryCount())
      throw new InvalidCategoryRelocateException();

    const groupCategories =
      await this.groupCategoryRepository.findAllByIdAndGroup(
        groupId,
        categoryRelocateRequest.order,
      );

    for (let index = 0; index < groupCategories.length; index++) {
      const category = groupCategories[index];
      category.seq = index + 1;
      await this.groupCategoryRepository.saveGroupCategory(category);
    }
  }

  @Transactional()
  async deleteCategory(user: User, groupId: number, categoryId: number) {
    const group =
      await this.groupRepository.findGroupByIdAndLeaderOrManagerUser(
        user,
        groupId,
      );
    if (!group) throw new UnauthorizedGroupCategoryException();

    const groupCategory = await this.groupCategoryRepository.findByIdAndGroup(
      group.id,
      categoryId,
    );
    group.deleteCategory();

    await this.groupRepository.saveGroup(group);
    await this.groupCategoryRepository.deleteCategory(groupCategory);
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
