import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { AchievementEntity } from './achievement.entity';
import { Achievement } from '../domain/achievement.domain';
import { FindOptionsWhere, LessThan } from 'typeorm';

export interface AchievementPaginationOption {
  categoryId: number;
  where__id__less_than?: number;
  take: number;
}
@CustomRepository(AchievementEntity)
export class AchievementRepository extends TransactionalRepository<AchievementEntity> {
  async findAll(
    userId: number,
    achievementPaginationOption: AchievementPaginationOption,
  ): Promise<Achievement[]> {
    const where: FindOptionsWhere<AchievementEntity> = {
      user: { id: userId },
      category: { id: achievementPaginationOption.categoryId },
    };
    if (achievementPaginationOption.where__id__less_than) {
      where.id = LessThan(achievementPaginationOption.where__id__less_than);
    }
    const achievementEntities = await this.repository.find({
      where,
      order: { createdAt: 'DESC' },
      take: achievementPaginationOption.take,
    });
    return achievementEntities.map((achievementEntity) =>
      achievementEntity.toModel(),
    );
  }

  async saveAchievement(achievement: Achievement): Promise<Achievement> {
    const achievementEntity = AchievementEntity.from(achievement);
    const saved = await this.repository.save(achievementEntity);
    return saved.toModel();
  }
}
