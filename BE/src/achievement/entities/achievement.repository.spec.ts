import { Test, TestingModule } from '@nestjs/testing';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { configServiceModuleOptions } from '../../config/config';
import { DataSource } from 'typeorm';
import { transactionTest } from '../../../test/common/transaction-test';
import { AchievementRepository } from './achievement.repository';
import { UsersFixture } from '../../../test/user/users-fixture';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { CategoryRepository } from '../../category/entities/category.repository';
import { CategoryFixture } from '../../../test/category/category-fixture';
import { AchievementTestModule } from '../../../test/achievement/achievement-test.module';
import { AchievementFixture } from '../../../test/achievement/achievement-fixture';
import { CategoryTestModule } from '../../../test/category/category-test.module';
import { Achievement } from '../domain/achievement.domain';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';
import { ImageFixture } from '../../../test/image/image-fixture';
import { Category } from '../../category/domain/category.domain';

describe('AchievementRepository test', () => {
  let achievementRepository: AchievementRepository;
  let dataSource: DataSource;
  let usersFixture: UsersFixture;
  let categoryFixture: CategoryFixture;
  let achievementFixture: AchievementFixture;
  let imageFixture: ImageFixture;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([
          AchievementRepository,
          CategoryRepository,
        ]),
        UsersTestModule,
        CategoryTestModule,
        AchievementTestModule,
      ],
    }).compile();

    imageFixture = module.get<ImageFixture>(ImageFixture);
    usersFixture = module.get<UsersFixture>(UsersFixture);
    categoryFixture = module.get<CategoryFixture>(CategoryFixture);
    achievementFixture = module.get<AchievementFixture>(AchievementFixture);
    achievementRepository = module.get<AchievementRepository>(
      AchievementRepository,
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('saveAchievement는 달성 기록을 저장할 수 있다.', () => {
    test('달성 기록을 저장할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const category = await categoryFixture.getCategory(user, '카테고리1');
        const image = await imageFixture.getImage(
          user,
          'imageUrl',
          'thumbnailUrl',
        );
        const achievement = new Achievement(
          user,
          category,
          '다이어트 1회차',
          '오늘의 닭가슴살',
          image,
        );

        // when
        const expected =
          await achievementRepository.saveAchievement(achievement);

        const retrievedAchievement =
          await achievementRepository.repository.findOne({
            where: {
              id: expected.id,
            },
            relations: ['image', 'category', 'user'],
          });

        // then
        expect(retrievedAchievement.title).toEqual('다이어트 1회차');
        expect(retrievedAchievement.content).toEqual('오늘의 닭가슴살');
        expect(retrievedAchievement.image.imageUrl).toEqual('imageUrl');
        expect(retrievedAchievement.image.thumbnailUrl).toEqual('thumbnailUrl');
      });
    });

    test('달성 기록을 수정할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const category = await categoryFixture.getCategory(user, '카테고리1');
        const category2 = await categoryFixture.getCategory(user, '카테고리2');
        const image = await imageFixture.getImage(
          user,
          'imageUrl',
          'thumbnailUrl',
        );
        const achievement = await achievementFixture.getAchievement(
          user,
          category,
          image,
        );
        const findAchievement = await achievementRepository.findByIdAndUser(
          user.id,
          achievement.id,
        );

        // when
        findAchievement.category = category2;
        findAchievement.title = '다이어트 2회차';
        findAchievement.content = '오늘의 닭가슴살 2';
        await achievementRepository.saveAchievement(findAchievement);

        const updatedAchievement =
          await achievementRepository.repository.findOne({
            where: {
              id: findAchievement.id,
            },
            relations: ['image', 'category', 'user'],
          });

        // then
        expect(updatedAchievement.title).toEqual('다이어트 2회차');
        expect(updatedAchievement.content).toEqual('오늘의 닭가슴살 2');
        expect(updatedAchievement.category.id).toEqual(category2.id);
        expect(updatedAchievement.category.name).toEqual(category2.name);
      });
    });
  });

  test('달성 기록을 조회한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, 'ABC');
      const achievements = [];
      for (let i = 0; i < 10; i++) {
        achievements.push(
          await achievementFixture.getAchievement(user, category),
        );
      }

      // when
      const achievementPaginationOption: PaginateAchievementRequest = {
        categoryId: category.id,
        take: 12,
      };
      const findAll = await achievementRepository.findAll(
        user.id,
        achievementPaginationOption,
      );

      // then
      expect(findAll.length).toEqual(10);
      expect(findAll[0].category.id).toEqual(category.id);
    });
  });

  test('카테고리 ID가 0인 경우에는 모든 달성 기록을 조회한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category_1 = await categoryFixture.getCategory(user, 'ABC');
      const category_2 = await categoryFixture.getCategory(user, 'DEF');

      const achievements: Achievement[] =
        await achievementFixture.getAchievements(10, user, category_1);
      achievements.push(
        ...(await achievementFixture.getAchievements(10, user, category_2)),
      );

      // when
      const achievementPaginationOption: PaginateAchievementRequest = {
        categoryId: 0,
        take: 12,
      };
      const findAll = await achievementRepository.findAll(
        user.id,
        achievementPaginationOption,
      );

      // then
      expect(findAll.length).toEqual(12);
    });
  });

  test('카테고리 ID가 -1인 경우에는 카테고리 미설정 달성 기록을 조회한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');

      const achievements: Achievement[] =
        await achievementFixture.getAchievements(10, user, null);
      achievements.push(
        ...(await achievementFixture.getAchievements(10, user, null)),
      );

      // when
      const achievementPaginationOption: PaginateAchievementRequest = {
        categoryId: -1,
        take: 12,
      };
      const findAll = await achievementRepository.findAll(
        user.id,
        achievementPaginationOption,
      );

      // then
      expect(findAll.length).toEqual(12);
    });
  });

  test('카테고리 ID를 넣지 않은 경우에도 모든 달성 기록을 조회한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category_1 = await categoryFixture.getCategory(user, 'ABC');
      const category_2 = await categoryFixture.getCategory(user, 'DEF');

      const achievements = [];
      for (let i = 0; i < 30; i++) {
        achievements.push(
          await achievementFixture.getAchievement(user, category_1),
        );
      }
      for (let i = 0; i < 30; i++) {
        achievements.push(
          await achievementFixture.getAchievement(user, category_2),
        );
      }

      // when
      const achievementPaginationOption: PaginateAchievementRequest =
        new PaginateAchievementRequest();
      const findAll = await achievementRepository.findAll(
        user.id,
        achievementPaginationOption,
      );

      // then
      expect(findAll.length).toEqual(30);
    });
  });

  test('달성 기록 상세 정보를 조회한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, 'ABC');
      const achievements: Achievement[] =
        await achievementFixture.getAchievements(10, user, category);

      // when
      const achievementDetail =
        await achievementRepository.findAchievementDetail(
          user.id,
          achievements[5].id,
        );

      // then
      expect(achievementDetail.id).toBeDefined();
      expect(achievementDetail.title).toBeDefined();
      expect(achievementDetail.content).toBeDefined();
      expect(achievementDetail.imageUrl).toBeDefined();
      expect(achievementDetail.category.id).toEqual(category.id);
      expect(achievementDetail.category.name).toEqual(category.name);
      expect(achievementDetail.category.achieveCount).toEqual(6);
    });
  });

  test('자신이 소유하지 않은 달성 기록 정보를 조회하면 null을 반환한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, 'ABC');

      const achievements: Achievement[] =
        await achievementFixture.getAchievements(10, user, category);

      // when
      const achievementDetail =
        await achievementRepository.findAchievementDetail(
          user.id + 1,
          achievements[5].id,
        );

      // then
      expect(achievementDetail).toBeNull();
    });
  });

  test('유효하지 않은 달성 기록 id를 통해 조회하면 null을 반환한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, 'ABC');
      await achievementFixture.getAchievements(10, user, category);

      // when
      const achievementDetail =
        await achievementRepository.findAchievementDetail(user.id + 1, 100);

      // then
      expect(achievementDetail).toBeNull();
    });
  });

  test('userId와 id로 달성 기록을 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, 'ABC');

      const achievement = await achievementFixture.getAchievement(
        user,
        category,
      );

      // when
      const findOne = await achievementRepository.findByIdAndUser(
        user.id,
        achievement.id,
      );

      // then
      expect(findOne.id).toEqual(achievement.id);
      expect(findOne.title).toEqual(achievement.title);
      expect(findOne.content).toEqual(achievement.content);
    });
  });

  describe('findByUserWithCount는 카테고리와 그 개수를 조회할 수 있다.', () => {
    it('findByUserWithCount는 사용자가 소유한 카테고리가 없으면 미등록 카테고리만 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        const user = await usersFixture.getUser(1);

        const retrievedCategories =
          await achievementRepository.findByCategoryWithCount(user);

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
        await achievementFixture.getAchievements(4, user, categories[0]);
        await achievementFixture.getAchievements(5, user, categories[1]);
        await achievementFixture.getAchievements(7, user, categories[2]);
        await achievementFixture.getAchievements(10, user, categories[3]);

        const retrievedCategories =
          await achievementRepository.findByCategoryWithCount(user);

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
});
