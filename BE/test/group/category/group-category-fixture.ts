import { GroupCategory } from '../../../src/group/category/domain/group.category';
import { User } from '../../../src/users/domain/user.domain';
import { Group } from '../../../src/group/group/domain/group.domain';

export class GroupCategoryFixture {
  static id: number = 0;

  static groupCategory(user: User, group: Group, name?: string) {
    return new GroupCategory(
      user,
      group,
      name || `gc-${GroupCategoryFixture.id++}`,
    );
  }
}
