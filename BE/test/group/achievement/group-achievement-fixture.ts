import { GroupAchievement } from '../../../src/group/achievement/domain/group-achievement.domain';
import { GroupCategory } from '../../../src/group/category/domain/group.category';
import { Group } from '../../../src/group/group/domain/group.domain';
import { User } from '../../../src/users/domain/user.domain';

export class GroupAchievementFixture {
  static id: number = 1;

  static groupAchievement(
    user: User,
    group: Group,
    groupCategory: GroupCategory,
    name?: string,
  ): GroupAchievement {
    return new GroupAchievement(
      name || `제목${++GroupAchievementFixture.id}`,
      user,
      group,
      groupCategory,
      `내용${GroupAchievementFixture.id}`,
    );
  }
}
