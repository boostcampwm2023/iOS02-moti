import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../entities/category.repository';
import { CategoryCreate } from '../dto/category-create';
import { Transactional } from '../../config/transaction-manager';
import { Category } from '../domain/category.domain';
import { User } from '../../users/domain/user.domain';
import { CategoryMetaData } from '../dto/category-metadata';
import { NotFoundCategoryException } from '../exception/not-found-category.exception';
import { CategoryRelocateRequest } from '../dto/category-relocate.request';
import { UserRepository } from '../../users/entities/user.repository';
import { InvalidCategoryRelocateException } from '../exception/Invalid-Category-Relocate.exception';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @Transactional()
  async saveCategory(
    categoryCreate: CategoryCreate,
    user: User,
  ): Promise<Category> {
    const category = user.newCategory(categoryCreate.name);
    await this.userRepository.updateUser(user);
    return await this.categoryRepository.saveCategory(category);
  }

  @Transactional({ readonly: true })
  async getCategoriesByUser(user: User): Promise<CategoryMetaData[]> {
    return this.categoryRepository.findCategoriesByUser(user);
  }

  @Transactional({ readonly: true })
  async getCategory(user: User, categoryId: number): Promise<CategoryMetaData> {
    const categoryMetaData = await this.categoryRepository.findCategory(
      user,
      categoryId,
    );
    if (!categoryMetaData) throw new NotFoundCategoryException();

    return categoryMetaData;
  }

  @Transactional()
  async relocateCategory(
    user: User,
    categoryRelocateRequest: CategoryRelocateRequest,
  ) {
    if (user.categoryCount != categoryRelocateRequest.getCategoryCount())
      throw new InvalidCategoryRelocateException();
    const categories = await this.categoryRepository.findAllByIdAndUser(
      user.id,
      categoryRelocateRequest.order,
    );

    for (let index = 0; index < categories.length; index++) {
      const category = categories[index];
      category.seq = index + 1;
      await this.categoryRepository.saveCategory(category);
    }
  }
}
