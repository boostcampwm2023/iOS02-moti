import { User } from '../../src/users/domain/user.domain';
import { Injectable } from '@nestjs/common';
import { Category } from '../../src/category/domain/category.domain';
import { CategoryRepository } from '../../src/category/entities/category.repository';
import { UserRepository } from '../../src/users/entities/user.repository';

@Injectable()
export class CategoryFixture {
  private static id = 0;

  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getCategory(user: User, name?: string): Promise<Category> {
    user.categoryCount++;
    user.categorySequence++;
    const category = CategoryFixture.category(
      user,
      name || CategoryFixture.getDummyCategoryName(),
    );
    await this.userRepository.updateUser(user);
    category.seq = user.categorySequence;
    return await this.categoryRepository.saveCategory(category);
  }

  async getCategories(
    count: number,
    user: User,
    name?: string,
  ): Promise<Category[]> {
    const categories: Category[] = [];
    for (let i = 0; i < count; i++) {
      const category = await this.getCategory(user, name);
      categories.push(category);
    }
    return categories;
  }

  static category(user: User, name: string) {
    return new Category(user, name, 0);
  }

  static getDummyCategoryName() {
    return `카테고리${++CategoryFixture.id}`;
  }
}
