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
import { GroupRepository } from '../../group/entities/group.repository';
import { UserGroupRepository } from '../../group/entities/user-group.repository';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { GroupAchievementTestModule } from '../../../../test/group/achievement/group-achievement-test.module';
import { GroupAchievement } from '../domain/group-achievement.domain';

describe('GroupRepository Test', () => {
  let groupAchievementRepository: GroupAchievementRepository;
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
        ]),
        UsersTestModule,
        GroupTestModule,
        GroupAchievementTestModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    groupAchievementRepository = app.get<GroupAchievementRepository>(
      GroupAchievementRepository,
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

  test('그룹 달성 기록을 저장할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const group = await groupFixture.createGroup('GROUP', user);
      const groupAchievement = new GroupAchievement(
        'title',
        user,
        group,
        null,
        `content`,
      );

      // when
      const saved =
        await groupAchievementRepository.saveGroupAchievement(groupAchievement);

      // then
      expect(saved.user.id).toEqual(user.id);
      expect(saved.group.id).toEqual(group.id);
      expect(saved.title).toEqual('title');
      expect(saved.content).toEqual('content');
    });
  });

  test('그룹 달성 기록 id로 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const group = await groupFixture.createGroup('GROUP', user);
      const groupAchievement =
        await groupAchievementFixture.createGroupAchievement(
          user,
          group,
          null,
          'title',
        );

      // when
      const findById = await groupAchievementRepository.findById(
        groupAchievement.id,
      );

      // then
      expect(findById.user.id).toEqual(user.id);
      expect(findById.user.userCode).toEqual(user.userCode);
      expect(findById.group.id).toEqual(group.id);
      expect(findById.id).toEqual(groupAchievement.id);
      expect(findById.title).toEqual(groupAchievement.title);
      expect(findById.content).toEqual(groupAchievement.content);
      expect(findById.createdAt).toEqual(groupAchievement.createdAt);
    });
  });
});
