import { User } from '../../src/users/domain/user.domain';
import { Injectable } from '@nestjs/common';
import { AchievementRepository } from '../../src/achievement/entities/achievement.repository';
import { Achievement } from '../../src/achievement/domain/achievement.domain';
import { Category } from '../../src/category/domain/category.domain';
import { ImageFixture } from '../image/image-fixture';
import { Image } from '../../src/image/domain/image.domain';

@Injectable()
export class AchievementFixture {
  static id = 0;

  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly imageFixture: ImageFixture,
  ) {}

  async getAchievement(
    user: User,
    category: Category,
    image?: Image,
  ): Promise<Achievement> {
    image = image || (await this.imageFixture.getImage(user));
    const achievement = AchievementFixture.achievement(user, category, image);
    console.log(achievement);
    return await this.achievementRepository.saveAchievement(achievement);
  }

  async getAchievements(
    count: number,
    user: User,
    category: Category,
  ): Promise<Achievement[]> {
    const achievements: Achievement[] = [];
    for (let i = 0; i < count; i++) {
      const achievement = await this.getAchievement(user, category);
      achievements.push(achievement);
    }
    return achievements;
  }

  static achievement(user: User, category: Category, image?: Image) {
    return new Achievement(
      user,
      category,
      `다이어트 ${++this.id}회차`,
      '오늘의 닭가슴살',
      image || ImageFixture.image(user),
    );
  }

  static achievements(count: number, user: User, category: Category) {
    const achievements: Achievement[] = [];
    for (let i = 0; i < count; i++) {
      const achievement = AchievementFixture.achievement(user, category);
      achievements.push(achievement);
    }
    return achievements;
  }
}
