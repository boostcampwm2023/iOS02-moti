import { Test, TestingModule } from '@nestjs/testing';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { configServiceModuleOptions } from '../../config/config';
import { DataSource } from 'typeorm';
import { transactionTest } from '../../../test/common/transaction-test';
import {
  AchievementPaginationOption,
  AchievementRepository,
} from './achievement.repository';
import { UsersFixture } from '../../../test/user/users-fixture';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { CategoryRepository } from '../../category/entities/category.repository';
import { CategoryFixture } from '../../../test/category/category-fixture';
import { AchievementTestModule } from '../../../test/achievement/achievement-test.module';
import { AchievementFixture } from '../../../test/achievement/achievement-fixture';
import { CategoryTestModule } from '../../../test/category/category-test.module';
import { Achievement } from '../domain/achievement.domain';

describe('AchievementRepository test', () => {
  let achievementRepository: AchievementRepository;
  let dataSource: DataSource;
  let usersFixture: UsersFixture;
  let categoryFixture: CategoryFixture;
  let achievementFixture: AchievementFixture;

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

  test('달성 기록을 저장할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const category = await categoryFixture.getCategory(user, '카테고리1');
      const achievement = new Achievement(
        user,
        category,
        '다이어트 1회차',
        '오늘의 닭가슴살',
        'imageUrl',
        'thumbnailUrl',
      );

      // when
      const expected = await achievementRepository.saveAchievement(achievement);

      // then
      expect(expected.title).toEqual('다이어트 1회차');
      expect(expected.content).toEqual('오늘의 닭가슴살');
      expect(expected.imageUrl).toEqual('imageUrl');
      expect(expected.thumbnailUrl).toEqual('thumbnailUrl');
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
      const achievementPaginationOption: AchievementPaginationOption = {
        categoryId: category.id,
        take: 12,
      };
      const findAll = await achievementRepository.findAll(
        user.id,
        achievementPaginationOption,
      );

      // then
      expect(findAll.length).toEqual(10);
    });
  });
});