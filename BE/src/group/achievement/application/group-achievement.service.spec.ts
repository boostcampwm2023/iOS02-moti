import { UsersFixture } from '../../../../test/user/users-fixture';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configServiceModuleOptions } from '../../../config/config';
import { typeOrmModuleOptions } from '../../../config/typeorm';
import { UsersTestModule } from '../../../../test/user/users-test.module';
import { transactionTest } from '../../../../test/common/transaction-test';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { GroupTestModule } from '../../../../test/group/group/group-test.module';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { GroupAchievementTestModule } from '../../../../test/group/achievement/group-achievement-test.module';
import { GroupCategoryTestModule } from '../../../../test/group/category/group-category-test.module';
import { GroupAchievementService } from './group-achievement.service';
import { GroupAchievementModule } from '../group-achievement.module';
import { UserGroupGrade } from '../../group/domain/user-group-grade';
import { NoSuchGroupAchievementException } from '../exception/no-such-group-achievement.exception';
import { InvalidRejectRequestException } from '../exception/invalid-reject-request.exception';

describe('GroupAchievementService Test', () => {
  let groupAchievementService: GroupAchievementService;
  let usersFixture: UsersFixture;
  let groupFixture: GroupFixture;
  let groupAchievementFixture: GroupAchievementFixture;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        GroupAchievementModule,
        UsersTestModule,
        GroupTestModule,
        GroupAchievementTestModule,
        GroupCategoryTestModule,
      ],
      providers: [],
    }).compile();

    groupAchievementService = module.get<GroupAchievementService>(
      GroupAchievementService,
    );
    usersFixture = module.get<UsersFixture>(UsersFixture);
    groupFixture = module.get<GroupFixture>(GroupFixture);
    groupAchievementFixture = module.get<GroupAchievementFixture>(
      GroupAchievementFixture,
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  test('그룹내 특정 달성기록을 차단할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('GROUP', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);
      const groupAchievement =
        await groupAchievementFixture.createGroupAchievement(
          user2,
          group,
          null,
          'title',
        );

      // when
      const rejectGroupAchievementResponse =
        await groupAchievementService.reject(
          user1,
          group.id,
          groupAchievement.id,
        );

      // then
      expect(rejectGroupAchievementResponse.userId).toEqual(user1.id);
      expect(rejectGroupAchievementResponse.groupAchievementId).toEqual(
        groupAchievement.id,
      );
    });
  });

  test('그룹내 존재하지 않는 달성기록을 차단하려고 하면 NoSuchGroupAchievementException를 던진다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('GROUP', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);
      const groupAchievement =
        await groupAchievementFixture.createGroupAchievement(
          user2,
          group,
          null,
          'title',
        );

      // when
      // then
      await expect(
        groupAchievementService.reject(
          user1,
          group.id,
          groupAchievement.id + 1,
        ),
      ).rejects.toThrow(NoSuchGroupAchievementException);
    });
  });
  test('다른 그룹의 달성기록을 차단하려고 하면 NoSuchGroupAchievementException를 던진다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group1 = await groupFixture.createGroup('GROUP1', user1);
      const group2 = await groupFixture.createGroup('GROUP2', user2);
      const group2Achievement =
        await groupAchievementFixture.createGroupAchievement(
          user2,
          group2,
          null,
          'title',
        );

      // when
      // then
      await expect(
        groupAchievementService.reject(user1, group1.id, group2Achievement.id),
      ).rejects.toThrow(InvalidRejectRequestException);
    });
  });
});
