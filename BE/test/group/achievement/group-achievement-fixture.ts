import { GroupAchievement } from '../../../src/group/achievement/domain/group-achievement.domain';
import { GroupCategory } from '../../../src/group/category/domain/group.category';
import { Group } from '../../../src/group/group/domain/group.domain';
import { User } from '../../../src/users/domain/user.domain';
import { Injectable } from '@nestjs/common';
import { GroupAchievementRepository } from '../../../src/group/achievement/entities/group-achievement.repository';
import { Image } from '../../../src/image/domain/image.domain';
import { ImageFixture } from '../../image/image-fixture';

@Injectable()
export class GroupAchievementFixture {
  static id: number = 1;

  constructor(
    private readonly groupAchievementRepository: GroupAchievementRepository,
    private readonly imageFixture: ImageFixture,
  ) {}
  async createGroupAchievement(
    user: User,
    group: Group,
    groupCategory: GroupCategory,
    name?: string,
    image?: Image,
  ) {
    image = image || (await this.imageFixture.getImage(user));
    const groupAchievement = GroupAchievementFixture.groupAchievement(
      user,
      group,
      groupCategory,
      name,
      image,
    );
    return await this.groupAchievementRepository.saveGroupAchievement(
      groupAchievement,
    );
  }

  async createGroupAchievements(
    count: number,
    user: User,
    group: Group,
    groupCategory: GroupCategory,
  ) {
    const groupAchievements: GroupAchievement[] = [];
    for (let i = 0; i < count; i++) {
      const groupAchievement = await this.createGroupAchievement(
        user,
        group,
        groupCategory,
      );
      groupAchievements.push(groupAchievement);
    }

    return groupAchievements;
  }

  static groupAchievement(
    user: User,
    group: Group,
    groupCategory: GroupCategory,
    name?: string,
    image?: Image,
  ): GroupAchievement {
    return new GroupAchievement(
      name || `제목${++GroupAchievementFixture.id}`,
      user,
      group,
      groupCategory,
      `내용${GroupAchievementFixture.id}`,
      image || ImageFixture.image(user),
    );
  }
}
