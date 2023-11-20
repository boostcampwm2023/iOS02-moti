import { User } from '../../src/users/domain/user.domain';
import { Injectable } from '@nestjs/common';
import { Category } from '../../src/category/domain/category.domain';
import { CategoryRepository } from '../../src/category/entities/category.repository';

@Injectable()
export class CategoryFixture {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategory(user: User, name: string): Promise<Category> {
    const category = CategoryFixture.category(user, name);
    return await this.categoryRepository.saveCategory(category);
  }

  static category(user: User, name: string) {
    return new Category(user, name);
  }
}
