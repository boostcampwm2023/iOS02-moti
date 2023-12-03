import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { AchievementEntity } from './achievement.entity';
import { Achievement } from '../domain/achievement.domain';
import { FindOptionsWhere, LessThan } from 'typeorm';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';
import { AchievementDetailResponse } from '../dto/achievement-detail-response';
import { IAchievementDetail } from '../index';
import { User } from '../../users/domain/user.domain';
import { ICategoryMetaData } from '../../category';
import { CategoryMetaData } from '../../category/dto/category-metadata';

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
        'COALESCE(a.category_id, -1) = COALESCE(achievement.category_id, -1) AND a.id <= achievement.id',
      )
      .leftJoin('image', 'i', 'i.achievement_id = achievement.id')
      .where('achievement.id = :achievementId', { achievementId })
      .andWhere('achievement.user_id = :userId', { userId })
      .getRawOne<IAchievementDetail>();

    if (result.id) return new AchievementDetailResponse(result);
    return null;
  }

  async findByCategoryWithCount(user: User) {
    const categories = await this.repository
      .createQueryBuilder('achievement')
      .select('COALESCE(category.id, -1) as categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('MAX(achievement.created_at)', 'insertedAt')
      .addSelect('COUNT(*)', 'achievementCount')
      .leftJoin('achievement.category', 'category')
      .where('achievement.user_id = :user', { user: user.id })
      .orderBy('category.id', 'ASC')
      .groupBy('category.id')
      .getRawMany<ICategoryMetaData>();

    return categories.map((category) => new CategoryMetaData(category));
  }

  async findByIdAndUser(userId: number, id: number): Promise<Achievement> {
    const achievementEntity = await this.repository.findOneBy({
      user: { id: userId },
      id: id,
    });
    return achievementEntity?.toModel();
  }
}
