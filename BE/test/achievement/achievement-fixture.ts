import { User } from '../../src/users/domain/user.domain';
import { Injectable } from '@nestjs/common';
import { AchievementRepository } from '../../src/achievement/entities/achievement.repository';
import { Achievement } from '../../src/achievement/domain/achievement.domain';
import { Category } from '../../src/category/domain/category.domain';

@Injectable()
export class AchievementFixture {
  static id = 0;

  constructor(private readonly achievementRepository: AchievementRepository) {}

  async getAchievement(user: User, category: Category): Promise<Achievement> {
    const achievement = AchievementFixture.achievement(user, category);
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

  static achievement(user: User, category: Category) {
    return new Achievement(
      user,
      category,
      `다이어트 ${++this.id}회차`,
      '오늘의 닭가슴살',
      `imageUrl${this.id}`,
      `thumbnailUrl${this.id}`,
    );
  }
}
