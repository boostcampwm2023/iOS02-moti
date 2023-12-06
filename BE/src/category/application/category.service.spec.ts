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
import { transactionTest } from '../../../test/common/transaction-test';
import { NotFoundCategoryException } from '../exception/not-found-category.exception';

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
        await categoryService.getCategoriesByUser(user);

      // then
      expect(retrievedCategories).toBeDefined();
      expect(retrievedCategories.length).toBe(1);
      expect(retrievedCategories[0].categoryId).toEqual(-1);
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
        await categoryService.getCategoriesByUser(user);

      // then
      expect(retrievedCategories.length).toBe(5);
      expect(retrievedCategories[0].categoryId).toEqual(-1);
      expect(retrievedCategories[0].insertedAt).toBeNull();
      expect(retrievedCategories[0].achievementCount).toBe(0);
      expect(retrievedCategories[1].categoryId).toEqual(categories[0].id);
      expect(retrievedCategories[1].insertedAt).toBeInstanceOf(Date);
      expect(retrievedCategories[1].achievementCount).toBe(4);
      expect(retrievedCategories[2].categoryId).toEqual(categories[1].id);
      expect(retrievedCategories[2].insertedAt).toBeInstanceOf(Date);
      expect(retrievedCategories[2].achievementCount).toBe(5);
      expect(retrievedCategories[3].categoryId).toEqual(categories[2].id);
      expect(retrievedCategories[3].insertedAt).toBeInstanceOf(Date);
      expect(retrievedCategories[3].achievementCount).toBe(7);
      expect(retrievedCategories[4].categoryId).toEqual(categories[3].id);
      expect(retrievedCategories[4].insertedAt).toBeInstanceOf(Date);
      expect(retrievedCategories[4].achievementCount).toBe(10);
    });
  });

  describe('getCategory는 특정 카테고리를 조회할 수 있다.', () => {
    it('user에 대한 카테고리가 있을 때 해당 카테고리 정보를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser(1);
        const category = await categoryFixture.getCategory(user, '카테고리1');

        // when
        const retrievedCategory = await categoryService.getCategory(
          user,
          category.id,
        );

        // then
        expect(retrievedCategory).toBeDefined();
        expect(retrievedCategory.categoryName).toEqual(category.name);
        expect(retrievedCategory.categoryId).toEqual(category.id);
        expect(retrievedCategory.insertedAt).toBeNull();
        expect(retrievedCategory.achievementCount).toBe(0);
      });
    });

    it('user에 대한 카테고리가 있을 때 해당 카테고리 정보를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser(1);
        const category = await categoryFixture.getCategory(user, '카테고리1');
        await achievementFixture.getAchievements(10, user, category);

        // when
        const retrievedCategory = await categoryService.getCategory(
          user,
          category.id,
        );

        // then
        expect(retrievedCategory).toBeDefined();
        expect(retrievedCategory.categoryName).toEqual(category.name);
        expect(retrievedCategory.categoryId).toEqual(category.id);
        expect(retrievedCategory.insertedAt).toBeInstanceOf(Date);
        expect(retrievedCategory.achievementCount).toBe(10);
      });
    });

    it('user에 대한 카테고리 조회 요청이 아닐 때 NotFoundCategoryException를 발생한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser(1);
        await categoryFixture.getCategory(user, '카테고리1');

        const other = await usersFixture.getUser(2);
        const otherCategory = await categoryFixture.getCategory(
          other,
          '카테고리2',
        );

        // when
        // then
        await expect(
          categoryService.getCategory(user, otherCategory.id),
        ).rejects.toThrow(NotFoundCategoryException);
      });
    });

    it('카테고리 아이디가 0이면 전체카테고리를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser(1);
        await categoryFixture.getCategory(user, '카테고리1');

        // when
        const retrievedCategory = await categoryService.getCategory(user, 0);

        // then
        expect(retrievedCategory).toBeDefined();
        expect(retrievedCategory.categoryName).toEqual('전체');
        expect(retrievedCategory.categoryId).toEqual(0);
        expect(retrievedCategory.insertedAt).toBeNull();
        expect(retrievedCategory.achievementCount).toBe(0);
      });
    });

    it('카테고리 아이디가 0이면 전체카테고리를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser(1);
        const category = await categoryFixture.getCategory(user, '카테고리1');
        await achievementFixture.getAchievements(10, user, category);

        // when
        const retrievedCategory = await categoryService.getCategory(user, 0);

        // then
        expect(retrievedCategory).toBeDefined();
        expect(retrievedCategory.categoryName).toEqual('전체');
        expect(retrievedCategory.categoryId).toEqual(0);
        expect(retrievedCategory.insertedAt).toBeInstanceOf(Date);
        expect(retrievedCategory.achievementCount).toBe(10);
      });
    });

    it('카테고리 아이디가 -1이면 미설정 카테고리를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser(1);
        await categoryFixture.getCategory(user, '카테고리1');

        // when
        const retrievedCategory = await categoryService.getCategory(user, -1);

        // then
        expect(retrievedCategory).toBeDefined();
        expect(retrievedCategory.categoryName).toEqual('미설정');
        expect(retrievedCategory.categoryId).toEqual(-1);
        expect(retrievedCategory.insertedAt).toBeNull();
        expect(retrievedCategory.achievementCount).toBe(0);
      });
    });

    it('카테고리 아이디가 -1이면 미설정 카테고리를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser(1);
        await categoryFixture.getCategory(user, '카테고리1');
        await achievementFixture.getAchievements(10, user, null);

        // when
        const retrievedCategory = await categoryService.getCategory(user, -1);

        // then
        expect(retrievedCategory).toBeDefined();
        expect(retrievedCategory.categoryName).toEqual('미설정');
        expect(retrievedCategory.categoryId).toEqual(-1);
        expect(retrievedCategory.insertedAt).toBeInstanceOf(Date);
        expect(retrievedCategory.achievementCount).toBe(10);
      });
    });

    it('카테고리 아이디가 0이면 전체 카테고리를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser(1);
        const category1 = await categoryFixture.getCategory(user, '카테고리1');
        const category2 = await categoryFixture.getCategory(user, '카테고리2');
        await achievementFixture.getAchievements(10, user, null);
        await achievementFixture.getAchievements(15, user, category1);
        await achievementFixture.getAchievements(25, user, category2);

        // when
        const retrievedCategory = await categoryService.getCategory(user, 0);

        // then
        expect(retrievedCategory).toBeDefined();
        expect(retrievedCategory.categoryName).toEqual('전체');
        expect(retrievedCategory.categoryId).toEqual(0);
        expect(retrievedCategory.insertedAt).toBeInstanceOf(Date);
        expect(retrievedCategory.achievementCount).toBe(50);
      });
    });
  });
});
