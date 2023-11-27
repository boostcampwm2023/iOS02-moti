import { Injectable } from '@nestjs/common';
import { AchievementRepository } from '../entities/achievement.repository';
import { AchievementResponse } from '../dto/achievement-response';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';
import { PaginateAchievementResponse } from '../dto/paginate-achievement-response';
import { AchievementDetailResponse } from '../dto/achievement-detail-response';
import { Transactional } from '../../config/transaction-manager';
import { NoSuchAchievementException } from '../exception/no-such-achievement.exception';
import { AchievementDeleteResponse } from '../dto/achievement-delete-response';

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

  @Transactional({ readonly: true })
  async getAchievementDetail(userId: number, achievementId: number) {
    const achievement: AchievementDetailResponse =
      await this.achievementRepository.findAchievementDetail(
        userId,
        achievementId,
      );
    if (!achievement) {
      throw new NoSuchAchievementException();
    }
    return achievement;
  }

  @Transactional()
  async delete(userId: number, id: number) {
    const achievement = await this.achievementRepository.findOneByUserIdAndId(
      userId,
      id,
    );
    if (!achievement) {
      throw new NoSuchAchievementException();
    }
    await this.achievementRepository.softDelete(achievement.id);
    return AchievementDeleteResponse.from(achievement);
  }
}
