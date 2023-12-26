import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { CategoryEntity } from './category.entity';
import { Category } from '../domain/category.domain';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { User } from '../../users/domain/user.domain';
import { ICategoryMetaData } from '../index';
import { CategoryMetaData } from '../dto/category-metadata';
import { AchievementEntity } from '../../achievement/entities/achievement.entity';
import { In, Repository } from 'typeorm';

@CustomRepository(CategoryEntity)
export class CategoryRepository extends TransactionalRepository<CategoryEntity> {
  async saveCategory(category: Category): Promise<Category> {
    const newCategory = CategoryEntity.from(category);
    await this.repository.save(newCategory);
    return newCategory.toModel();
  }

  async findById(id: number): Promise<Category> {
    const category = await this.repository.findOne({ where: { id: id } });
    return category?.toModel();
  }

  async findCategoriesByUser(user: User): Promise<CategoryMetaData[]> {
    const notSpecifiedCategoryMetaData =
      await this.findNotSpecifiedByUserAndId(user);
    const categoryMetaData = await this.findAllByUserWithCount(user);
    return [notSpecifiedCategoryMetaData, ...categoryMetaData];
  }

  async findCategory(
    user: User,
    categoryId: number,
  ): Promise<CategoryMetaData> {
    if (categoryId === -1) return this.findNotSpecifiedByUserAndId(user);
    if (categoryId === 0) return this.findTotalCategoryMetadata(user);
    return this.findByUserWithCount(user, categoryId);
  }

  async findAllByUserWithCount(user: User): Promise<CategoryMetaData[]> {
    const categories = await this.repository
      .createQueryBuilder('category')
      .select('category.id as categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('MAX(achievement.created_at)', 'insertedAt')
      .addSelect('COUNT(achievement.id)', 'achievementCount')
      .leftJoin('category.achievements', 'achievement')
      .where('category.user_id = :user', { user: user.id })
      .orderBy('category.seq', 'ASC')
      .groupBy('category.id')
      .getRawMany<ICategoryMetaData>();

    return categories.map((category) => new CategoryMetaData(category));
  }

  async findByUserWithCount(
    user: User,
    categoryId: number,
  ): Promise<CategoryMetaData> {
    const category = await this.repository
      .createQueryBuilder('category')
      .select('category.id as categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('MAX(achievement.created_at)', 'insertedAt')
      .addSelect('COUNT(achievement.id)', 'achievementCount')
      .leftJoin('category.achievements', 'achievement')
      .where('category.user_id = :user', { user: user.id })
      .andWhere('category.id = :categoryId', { categoryId: categoryId })
      .orderBy('category.seq', 'ASC')
      .groupBy('category.id')
      .getRawOne<ICategoryMetaData>();

    if (!category) return null;
    return new CategoryMetaData(category);
  }

  async findTotalCategoryMetadata(user: User): Promise<CategoryMetaData> {
    const achievementRepository: Repository<AchievementEntity> =
      this.repository.manager.getRepository(AchievementEntity);

    const category = await achievementRepository
      .createQueryBuilder('achievement')
      .select('0 as categoryId')
      .addSelect(`'전체' as categoryName`)
      .addSelect('MAX(achievement.created_at)', 'insertedAt')
      .addSelect('COUNT(*)', 'achievementCount')
      .where('achievement.user_id = :user', { user: user.id })
      .getRawOne<ICategoryMetaData>();

    return new CategoryMetaData(category);
  }

  async findNotSpecifiedByUserAndId(user: User): Promise<CategoryMetaData> {
    const achievementRepository: Repository<AchievementEntity> =
      this.repository.manager.getRepository(AchievementEntity);

    const category = await achievementRepository
      .createQueryBuilder('achievement')
      .select('-1 as categoryId')
      .addSelect(`'미설정' as categoryName`)
      .addSelect('MAX(achievement.created_at)', 'insertedAt')
      .addSelect('COUNT(*)', 'achievementCount')
      .where('achievement.category_id is NULL')
      .andWhere('achievement.user_id = :user', { user: user.id })
      .getRawOne<ICategoryMetaData>();

    return new CategoryMetaData(category);
  }

  async findByIdAndUser(userId: number, id: number): Promise<Category> {
    const categoryEntity = await this.repository.findOneBy({
      user: { id: userId },
      id: id,
    });
    return categoryEntity?.toModel();
  }

  async findAllByIdAndUser(userId: number, ids: number[]): Promise<Category[]> {
    const categories = await this.repository
      .createQueryBuilder('c')
      .where('c.user_id = :userId')
      .andWhere({ id: In(ids) })
      .setParameter('userId', userId)
      .orderBy(`FIELD(c.id, :...ids)`)
      .setParameter('ids', ids)
      .getMany();

    return categories.map((c) => c.toModel());
  }
}
