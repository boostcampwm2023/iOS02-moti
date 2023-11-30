import { GroupAchievement } from '../../../src/group/achievement/domain/group-achievement.domain';
import { GroupCategory } from '../../../src/group/category/domain/group.category';
import { Group } from '../../../src/group/group/domain/group.domain';
import { User } from '../../../src/users/domain/user.domain';
import { Injectable } from '@nestjs/common';
import { GroupAchievementRepository } from '../../../src/group/achievement/entities/group-achievement.repository';

@Injectable()
export class GroupAchievementFixture {
  static id: number = 1;

  constructor(
    private readonly groupAchievementRepository: GroupAchievementRepository,
  ) {}
  async createGroupAchievement(
    user: User,
    group: Group,
    groupCategory: GroupCategory,
    name?: string,
  ) {
    const groupAchievement = GroupAchievementFixture.groupAchievement(
      user,
      group,
      groupCategory,
      name,
    );
    return await this.groupAchievementRepository.saveGroupAchievement(
      groupAchievement,
    );
  }

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
