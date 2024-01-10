import { GroupCategory } from '../../../src/group/category/domain/group.category';
import { User } from '../../../src/users/domain/user.domain';
import { Group } from '../../../src/group/group/domain/group.domain';
import { GroupCategoryRepository } from '../../../src/group/category/entities/group-category.repository';
import { Injectable } from '@nestjs/common';
import { GroupRepository } from '../../../src/group/group/entities/group.repository';

@Injectable()
export class GroupCategoryFixture {
  static id: number = 0;

  constructor(
    private readonly groupCategoryRepository: GroupCategoryRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async createCategory(user: User, group: Group, name?: string) {
    const groupCategory = GroupCategoryFixture.groupCategory(user, group, name);
    await this.groupRepository.saveGroup(group);
    return await this.groupCategoryRepository.saveGroupCategory(groupCategory);
  }
  static groupCategory(user: User, group: Group, name?: string) {
    ++group.categoryCount;
    return new GroupCategory(
      user,
      group,
      name || `gc-${GroupCategoryFixture.id++}`,
      ++group.categorySequence,
    );
  }
}
