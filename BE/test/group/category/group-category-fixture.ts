import { GroupCategory } from '../../../src/group/category/domain/group.category';
import { User } from '../../../src/users/domain/user.domain';
import { Group } from '../../../src/group/group/domain/group.domain';
import { GroupCategoryRepository } from '../../../src/group/category/entities/group-category.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupCategoryFixture {
  static id: number = 0;

  constructor(
    private readonly groupCategoryRepository: GroupCategoryRepository,
  ) {}

  async createCategory(user: User, group: Group, name?: string) {
    const groupCategory = GroupCategoryFixture.groupCategory(user, group, name);
    return await this.groupCategoryRepository.saveGroupCategory(groupCategory);
  }
  static groupCategory(user: User, group: Group, name?: string) {
    return new GroupCategory(
      user,
      group,
      name || `gc-${GroupCategoryFixture.id++}`,
    );
  }
}
