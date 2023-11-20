import { Injectable } from '@nestjs/common';
import { AchievementRepository } from '../entities/achievement.repository';
import { AchievementResponse } from '../dto/achievement-response';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';
import { PaginateAchievementResponse } from '../dto/paginate-achievement-response';

@Injectable()
export class AchievementService {
  constructor(private readonly achievementRepository: AchievementRepository) {}
  async getAchievements(
    userId: number,
    paginateAchievementRequest: PaginateAchievementRequest,
  ) {
    const achievements = await this.achievementRepository.findAll(
      userId,
      paginateAchievementRequest,
    );
    return new PaginateAchievementResponse(
      paginateAchievementRequest,
      achievements.map((achievement) => AchievementResponse.from(achievement)),
    );
  }
}
