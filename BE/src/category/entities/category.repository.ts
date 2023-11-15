import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { CategoryEntity } from './category.entity';
import { Category } from '../domain/category.domain';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';

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
}
