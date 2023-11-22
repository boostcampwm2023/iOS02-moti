import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { AchievementEntity } from './achievement.entity';
import { Achievement } from '../domain/achievement.domain';
import { FindOptionsWhere, LessThan } from 'typeorm';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';
import { AchievementDetailResponse } from '../dto/achievement-detail-response';
import { IAchievementDetail } from '../index';

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

  async findAchievementDetail(userId: number, achievementId: number) {
    const result = await this.repository
      .createQueryBuilder('achievement')
      .leftJoinAndSelect('achievement.category', 'category')
      .select([
        'achievement.id as id',
        'achievement.title as title',
        'achievement.content as content',
        'achievement.imageUrl as imageUrl',
        'achievement.created_at as createdAt',
        'category.id as categoryId',
        'category.name as categoryName',
      ])
      .addSelect(['COUNT(a.id) as achieveCount'])
      .leftJoin(
        'achievement',
        'a',
        'a.category_id = achievement.category_id AND a.id <= achievement.id',
      )
      .where('achievement.id = :achievementId', { achievementId })
      .andWhere('achievement.user_id = :userId', { userId })
      .getRawOne<IAchievementDetail>();

    if (result.id) {
      return new AchievementDetailResponse(result);
    }
    return null;
  }
}
