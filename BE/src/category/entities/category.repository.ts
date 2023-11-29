import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { CategoryEntity } from './category.entity';
import { Category } from '../domain/category.domain';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { User } from '../../users/domain/user.domain';
import { ICategoryMetaData } from '../index';
import { CategoryMetaData } from '../dto/category-metadata';

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

  async findByUserWithCount(user: User): Promise<CategoryMetaData[]> {
    const categories = await this.repository
      .createQueryBuilder('category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('MAX(achievement.created_at)', 'insertedAt')
      .addSelect('COUNT(achievement.id)', 'achievementCount')
      .leftJoin('category.achievements', 'achievement')
      .where('category.user_id = :user', { user: user.id })
      .orderBy('category.id', 'ASC')
      .groupBy('category.id')
      .getRawMany<ICategoryMetaData>();

    return categories.map((category) => new CategoryMetaData(category));
  }

  async findByIdAndUser(userId: number, id: number): Promise<Category> {
    const categoryEntity = await this.repository.findOneBy({
      user: { id: userId },
      id: id,
    });
    return categoryEntity?.toModel();
  }
}
