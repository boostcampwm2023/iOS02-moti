import { DataSource } from 'typeorm';
import { UsersFixture } from '../../../test/user/users-fixture';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { OperateModule } from '../../operate/operate.module';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { CategoryService } from './category.service';
import { CategoryCreate } from '../dto/category-create';
import { AchievementTestModule } from '../../../test/achievement/achievement-test.module';
import { AchievementFixture } from '../../../test/achievement/achievement-fixture';
import { Category } from '../domain/category.domain';
import { CategoryTestModule } from '../../../test/category/category-test.module';
import { CategoryFixture } from '../../../test/category/category-fixture';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let dataSource: DataSource;
  let usersFixture: UsersFixture;
  let categoryFixture: CategoryFixture;
  let achievementFixture: AchievementFixture;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        UsersTestModule,
        OperateModule,
        ConfigModule.forRoot(configServiceModuleOptions),
        CategoryTestModule,
        AchievementTestModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    categoryFixture = app.get<CategoryFixture>(CategoryFixture);
    achievementFixture = app.get<AchievementFixture>(AchievementFixture);
    usersFixture = app.get<UsersFixture>(UsersFixture);
    categoryService = app.get<CategoryService>(CategoryService);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('테스트 환경 확인', () => {
    it('categoryService가 정의되어 있어야 한다.', () => {
      expect(categoryService).toBeDefined();
    });
  });

  it('saveCategory는 카테고리를 생성할 수 있다.', async () => {
    // given
    const user = await usersFixture.getUser(1);
    const categoryCreate = new CategoryCreate('카테고리1');

    // when
    const savedCategory = await categoryService.saveCategory(
      categoryCreate,
      user,
    );

    // then
    expect(savedCategory.name).toBe('카테고리1');
    expect(savedCategory.user).toStrictEqual(user);
  });

  describe('getCategoriesByUsers는 카테고리를 조회할 수 있다', () => {
    it('user에 대한 카테고리가 없을 때 빈 배열을 반환한다.', async () => {
      // given
      const user = await usersFixture.getUser(1);

      // when
      const retrievedCategories =
        await categoryService.getCategoriesByUsers(user);

      // then
      expect(retrievedCategories).toBeDefined();
      expect(retrievedCategories.length).toBe(0);
    });

    it('user에 대한 카테고리가 있을 때 카테고리를 반환한다.', async () => {
      // given
      const user = await usersFixture.getUser(1);
      const categories: Category[] = await categoryFixture.getCategories(
        4,
        user,
      );
      await achievementFixture.getAchievements(4, user, categories[0]);
      await achievementFixture.getAchievements(5, user, categories[1]);
      await achievementFixture.getAchievements(7, user, categories[2]);
      await achievementFixture.getAchievements(10, user, categories[3]);

      // when
      const retrievedCategories =
        await categoryService.getCategoriesByUsers(user);

      // then
      expect(retrievedCategories.length).toBe(4);
      expect(retrievedCategories[0].categoryId).toEqual(categories[0].id);
      expect(retrievedCategories[0].insertedAt).toBeInstanceOf(Date);
      expect(retrievedCategories[0].achievementCount).toBe(4);
      expect(retrievedCategories[1].categoryId).toEqual(categories[1].id);
      expect(retrievedCategories[1].insertedAt).toBeInstanceOf(Date);
      expect(retrievedCategories[1].achievementCount).toBe(5);
      expect(retrievedCategories[2].categoryId).toEqual(categories[2].id);
      expect(retrievedCategories[2].insertedAt).toBeInstanceOf(Date);
      expect(retrievedCategories[2].achievementCount).toBe(7);
      expect(retrievedCategories[3].categoryId).toEqual(categories[3].id);
      expect(retrievedCategories[3].insertedAt).toBeInstanceOf(Date);
      expect(retrievedCategories[3].achievementCount).toBe(10);
    });
  });
});
