import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { AchievementEntity } from './achievement.entity';
import { Achievement } from '../domain/achievement.domain';
import { FindOptionsWhere, IsNull, LessThan } from 'typeorm';
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
    if (achievementPaginationOption?.categoryId === -1) {
      where.category = { id: IsNull() };
    }
    if (achievementPaginationOption.whereIdLessThan) {
      where.id = LessThan(achievementPaginationOption.whereIdLessThan);
    }
    const achievementEntities = await this.repository.find({
      where,
      order: { createdAt: 'DESC' },
      take: achievementPaginationOption.take,
      relations: {
        category: true,
      },
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
      .select('achievement.id', 'id')
      .addSelect('achievement.title', 'title')
      .addSelect('achievement.content', 'content')
      .addSelect('i.imageUrl', 'imageUrl')
      .addSelect('achievement.created_at', 'createdAt')
      .addSelect('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('COUNT(a.id)', 'achieveCount')
      .leftJoin(
        'achievement',
        'a',
        'COALESCE(a.category_id, -1) = COALESCE(achievement.category_id, -1) AND a.id <= achievement.id and a.user_id = achievement.user_id',
      )
      .leftJoin('image', 'i', 'i.achievement_id = achievement.id')
      .where('achievement.id = :achievementId', { achievementId })
      .andWhere('achievement.user_id = :userId', { userId })
      .getRawOne<IAchievementDetail>();

    if (result.id) return new AchievementDetailResponse(result);
    return null;
  }

  async findByIdAndUser(userId: number, id: number): Promise<Achievement> {
    const achievementEntity = await this.repository.findOneBy({
      user: { id: userId },
      id: id,
    });
    return achievementEntity?.toModel();
  }
}
