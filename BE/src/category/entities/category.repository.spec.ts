import { CategoryRepository } from './category.repository';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { OperateModule } from '../../operate/operate.module';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { UsersFixture } from '../../../test/user/users-fixture';
import { Category } from '../domain/category.domain';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { transactionTest } from '../../../test/common/transaction-test';
import { AchievementFixture } from '../../../test/achievement/achievement-fixture';
import { AchievementTestModule } from '../../../test/achievement/achievement-test.module';
import { CategoryTestModule } from '../../../test/category/category-test.module';
import { CategoryFixture } from '../../../test/category/category-fixture';

describe('CategoryRepository', () => {
  let categoryRepository: CategoryRepository;
  let categoryFixture: CategoryFixture;
  let dataSource: DataSource;
  let usersFixture: UsersFixture;
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
    categoryRepository = app.get<CategoryRepository>(CategoryRepository);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('테스트 환경 확인', () => {
    it('categoryRepository가 정의되어 있어야 한다.', () => {
      expect(categoryRepository).toBeDefined();
    });
  });

  it('saveCategory는 카테고리를 생성할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = new Category(user, '카테고리1', 0);

      // when
      const savedCategory = await categoryRepository.saveCategory(category);

      // then
      expect(savedCategory.name).toBe('카테고리1');
      expect(savedCategory.user).toEqual(user);
    });
  });

  it('findById는 id로 user를 제외된 카테고리를 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser(1);
      const category = new Category(user, '카테고리1', 0);
      const savedCategory = await categoryRepository.saveCategory(category);

      // when
      const retrievedCategory = await categoryRepository.findById(
        savedCategory.id,
      );

      // then
      expect(retrievedCategory.name).toBe('카테고리1');
      expect(retrievedCategory.user).toBeUndefined();
    });
  });

  it('findByUserWithCount는 사용자가 소유한 카테고리가 없으면 빈 배열을 반환한다.', async () => {
    await transactionTest(dataSource, async () => {
      const user = await usersFixture.getUser(1);

      const retrievedCategories =
        await categoryRepository.findAllByUserWithCount(user);

      expect(retrievedCategories).toBeDefined();
      expect(retrievedCategories.length).toBe(0);
    });
  });

  it('findByUserWithCount', async () => {
    await transactionTest(dataSource, async () => {
      const user = await usersFixture.getUser(1);
      const categories: Category[] = await categoryFixture.getCategories(
        4,
        user,
      );
      const category = await categoryFixture.getCategory(user);
      await achievementFixture.getAchievements(4, user, categories[0]);
      await achievementFixture.getAchievements(5, user, categories[1]);
      await achievementFixture.getAchievements(7, user, categories[2]);
      await achievementFixture.getAchievements(10, user, categories[3]);

      const retrievedCategories =
        await categoryRepository.findAllByUserWithCount(user);

      expect(retrievedCategories.length).toBe(5);
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
      expect(retrievedCategories[4].categoryId).toEqual(category.id);
      expect(retrievedCategories[4].insertedAt).toBeNull();
      expect(retrievedCategories[4].achievementCount).toBe(0);
    });
  });

  it('userId와 id로 카테고리를 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, 'ABC');

      // when
      const findOne = await categoryRepository.findByIdAndUser(
        user.id,
        category.id,
      );

      // then
      expect(findOne.id).toEqual(category.id);
      expect(findOne.name).toEqual('ABC');
    });
  });

  it('findNotSpecifiedByUserAndId는 사용자의 미분류 카테고리를 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      await categoryFixture.getCategory(user, '미분류');
      await achievementFixture.getAchievements(4, user, null);

      // when
      const retrievedCategory =
        await categoryRepository.findNotSpecifiedByUserAndId(user);

      // then
      expect(retrievedCategory.categoryId).toEqual(-1);
      expect(retrievedCategory.categoryName).toEqual('미설정');
      expect(retrievedCategory.insertedAt).toBeInstanceOf(Date);
      expect(retrievedCategory.achievementCount).toBe(4);
    });
  });

  describe('findByUserWithCount은 특정 카테고리의 메타데이터를 조회할 수 있다.', () => {
    it('사용자가 소유한 카테고리가 없으면 null을 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        await categoryFixture.getCategory(user, '미분류');
        await achievementFixture.getAchievements(4, user, null);

        const other = await usersFixture.getUser('DEF');
        const otherCategory = await categoryFixture.getCategory(
          other,
          '카테고리',
        );

        // when
        const retrievedCategory = await categoryRepository.findByUserWithCount(
          user,
          otherCategory.id,
        );

        // then
        expect(retrievedCategory).toBeNull();
      });
    });

    it('사용자가 소유한 카테고리가 있으면 카테고리의 메타데이터를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const category = await categoryFixture.getCategory(user, '카테고리~');
        await achievementFixture.getAchievements(7, user, category);

        // when
        const retrievedCategory = await categoryRepository.findByUserWithCount(
          user,
          category.id,
        );

        // then
        expect(retrievedCategory.categoryId).toEqual(category.id);
        expect(retrievedCategory.categoryName).toEqual('카테고리~');
        expect(retrievedCategory.insertedAt).toBeInstanceOf(Date);
        expect(retrievedCategory.achievementCount).toBe(7);
      });
    });
  });

  describe('findTotalCategoryMetadata는 사용자의 전체 카테고리 메타데이터를 조회할 수 있다.', () => {
    it('사용자가 소유한 카테고리가 없어도 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');

        // when
        const retrievedCategory =
          await categoryRepository.findTotalCategoryMetadata(user);

        // then
        expect(retrievedCategory.categoryId).toEqual(0);
        expect(retrievedCategory.categoryName).toEqual('전체');
        expect(retrievedCategory.insertedAt).toBeNull();
        expect(retrievedCategory.achievementCount).toBe(0);
      });
    });

    it('사용자가 소유한 카테고리가 있으면 카테고리의 메타데이터를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const category = await categoryFixture.getCategory(user, '미분류');
        await achievementFixture.getAchievements(10, user, category);
        await achievementFixture.getAchievements(4, user, null);

        // when
        const retrievedCategory =
          await categoryRepository.findTotalCategoryMetadata(user);

        // then
        expect(retrievedCategory.categoryId).toEqual(0);
        expect(retrievedCategory.categoryName).toEqual('전체');
        expect(retrievedCategory.insertedAt).toBeInstanceOf(Date);
        expect(retrievedCategory.achievementCount).toBe(14);
      });
    });
  });
});
