import { Test, TestingModule } from '@nestjs/testing';
import { AchievementService } from './achievement.service';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { AchievementRepository } from '../entities/achievement.repository';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { UsersFixture } from '../../../test/user/users-fixture';
import { CategoryFixture } from '../../../test/category/category-fixture';
import { AchievementFixture } from '../../../test/achievement/achievement-fixture';
import { CategoryTestModule } from '../../../test/category/category-test.module';
import { AchievementTestModule } from '../../../test/achievement/achievement-test.module';
import { PaginateAchievementRequest } from '../dto/paginate-achievement-request';
import { NoSuchAchievementException } from '../exception/no-such-achievement.exception';

describe('AchievementService Test', () => {
  let achievementService: AchievementService;
  let usersFixture: UsersFixture;
  let categoryFixture: CategoryFixture;
  let achievementFixture: AchievementFixture;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([AchievementRepository]),
        UsersTestModule,
        CategoryTestModule,
        AchievementTestModule,
      ],
      providers: [AchievementService],
    }).compile();

    achievementService = module.get<AchievementService>(AchievementService);
    usersFixture = module.get<UsersFixture>(UsersFixture);
    categoryFixture = module.get<CategoryFixture>(CategoryFixture);
    achievementFixture = module.get<AchievementFixture>(AchievementFixture);
  });

  test('개인 달성 기록 리스트에 대한 페이지네이션 조회를 할 수 있다.', async () => {
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
    const firstRequest = new PaginateAchievementRequest(category.id, 4);
    const firstResponse = await achievementService.getAchievements(
      user.id,
      firstRequest,
    );

    const nextRequest = new PaginateAchievementRequest(
      category.id,
      4,
      firstResponse.next.whereIdLessThan,
    );
    const nextResponse = await achievementService.getAchievements(
      user.id,
      nextRequest,
    );

    const lastRequest = new PaginateAchievementRequest(
      category.id,
      4,
      nextResponse.next.whereIdLessThan,
    );
    const lastResponse = await achievementService.getAchievements(
      user.id,
      lastRequest,
    );

    expect(firstResponse.count).toEqual(4);
    expect(firstResponse.data.length).toEqual(4);
    expect(firstResponse.next.whereIdLessThan).toEqual(7);

    expect(nextResponse.count).toEqual(4);
    expect(nextResponse.data.length).toEqual(4);
    expect(nextResponse.next.whereIdLessThan).toEqual(3);

    expect(lastResponse.count).toEqual(2);
    expect(lastResponse.data.length).toEqual(2);
    expect(lastResponse.next).toEqual(null);
  });

  test('달성 기록 상세정보를 조회를 할 수 있다.', async () => {
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
    const detail = await achievementService.getAchievementDetail(
      user.id,
      achievements[7].id,
    );

    expect(detail.id).toBeDefined();
    expect(detail.title).toBeDefined();
    expect(detail.content).toBeDefined();
    expect(detail.imageUrl).toBeDefined();
    expect(detail.category.id).toEqual(category.id);
    expect(detail.category.name).toEqual(category.name);
    expect(detail.category.round).toEqual(8);
  });

  test('자신이 소유하지 않은 달성 기록 정보를 조회하면 NoSuchAchievementException을 던진다.', async () => {
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
    // then
    await expect(
      achievementService.getAchievementDetail(user.id + 1, achievements[7].id),
    ).rejects.toThrow(NoSuchAchievementException);
  });

  test('유효하지 않은 달성 기록 id를 통해 조회하면 NoSuchAchievementException를 던진다.', async () => {
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
    // then
    await expect(
      achievementService.getAchievementDetail(user.id, achievements[9].id + 1),
    ).rejects.toThrow(NoSuchAchievementException);
  });
});
