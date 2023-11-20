import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { AchievementEntity } from './achievement.entity';
import { Achievement } from '../domain/achievement.domain';
import { FindOptionsWhere, LessThan } from 'typeorm';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';

@CustomRepository(AchievementEntity)
export class AchievementRepository extends TransactionalRepository<AchievementEntity> {
  async findAll(
    userId: number,
    achievementPaginationOption: PaginateAchievementRequest,
  ): Promise<Achievement[]> {
    const where: FindOptionsWhere<AchievementEntity> = {
      user: { id: userId },
    };
    if (achievementPaginationOption?.categoryId !== 0) {
      where.category = { id: achievementPaginationOption.categoryId };
    }
    if (achievementPaginationOption.whereIdLessThan) {
      where.id = LessThan(achievementPaginationOption.whereIdLessThan);
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
