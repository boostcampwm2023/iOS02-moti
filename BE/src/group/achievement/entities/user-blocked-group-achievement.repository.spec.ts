import { DataSource } from 'typeorm';
import { UsersFixture } from '../../../../test/user/users-fixture';
import { typeOrmModuleOptions } from '../../../config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UsersTestModule } from '../../../../test/user/users-test.module';
import { configServiceModuleOptions } from '../../../config/config';
import { transactionTest } from '../../../../test/common/transaction-test';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { CustomTypeOrmModule } from '../../../config/typeorm/custom-typeorm.module';
import { GroupTestModule } from '../../../../test/group/group/group-test.module';
import { GroupAchievementRepository } from './group-achievement.repository';
import { UserBlockedGroupAchievementRepository } from './user-blocked-group-achievement.repository';
import { GroupRepository } from '../../group/entities/group.repository';
import { UserGroupRepository } from '../../group/entities/user-group.repository';
import { UserBlockedGroupAchievement } from '../domain/user-blocked-group-achievement.domain';
import { UserGroupGrade } from '../../group/domain/user-group-grade';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { GroupAchievementTestModule } from '../../../../test/group/achievement/group-achievement-test.module';

describe('UserBlockedGroupAchievementRepository Test', () => {
  let userBlockedGroupAchievementRepository: UserBlockedGroupAchievementRepository;
  let groupFixture: GroupFixture;
  let usersFixture: UsersFixture;
  let groupAchievementFixture: GroupAchievementFixture;
  let dataSource: DataSource;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([
          GroupRepository,
          UserGroupRepository,
          GroupAchievementRepository,
          UserBlockedGroupAchievementRepository,
        ]),
        UsersTestModule,
        GroupTestModule,
        GroupAchievementTestModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    userBlockedGroupAchievementRepository =
      app.get<UserBlockedGroupAchievementRepository>(
        UserBlockedGroupAchievementRepository,
      );
    usersFixture = app.get<UsersFixture>(UsersFixture);
    groupFixture = app.get<GroupFixture>(GroupFixture);
    groupAchievementFixture = app.get<GroupAchievementFixture>(
      GroupAchievementFixture,
    );
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  test('특정 유저가 그룹 내에서 차단한 달성 기록 정보를 저장한다.', async () => {
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
      const saved =
        await userBlockedGroupAchievementRepository.saveUserBlockedGroupAchievement(
          new UserBlockedGroupAchievement(user1, groupAchievement),
        );

      // then
      expect(saved.user.id).toEqual(user1.id);
      expect(saved.groupAchievement.id).toEqual(groupAchievement.id);
    });
  });
});
