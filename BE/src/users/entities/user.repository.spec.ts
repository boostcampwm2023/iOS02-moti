import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { User } from '../domain/user.domain';
import { configServiceModuleOptions } from '../../config/config';
import { DataSource } from 'typeorm';
import { transactionTest } from '../../../test/common/transaction-test';
import { UserRole } from '../domain/user-role';
import { UsersFixture } from '../../../test/user/users-fixture';
import { GroupFixture } from '../../../test/group/group/group-fixture';
import { UserGroupGrade } from '../../group/group/domain/user-group-grade';
import { GroupAchievementFixture } from '../../../test/group/achievement/group-achievement-fixture';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { GroupTestModule } from '../../../test/group/group/group-test.module';
import { GroupAchievementTestModule } from '../../../test/group/achievement/group-achievement-test.module';
import { dateFormat } from '../../common/utils/date-formatter';

describe('UserRepository test', () => {
  let usersRepository: UserRepository;
  let groupFixture: GroupFixture;
  let usersFixture: UsersFixture;
  let groupAchievementFixture: GroupAchievementFixture;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([UserRepository]),
        UsersTestModule,
        GroupTestModule,
        GroupAchievementTestModule,
      ],
    }).compile();

    usersRepository = module.get<UserRepository>(UserRepository);
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

  test('userIdentifier로 user를 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = User.from('userIdentifier');
      user.assignUserCode('A1B2C1D');
      await usersRepository.saveUser(user);

      // when
      const findOne =
        await usersRepository.findOneByUserIdentifier('userIdentifier');

      // then
      expect(findOne.userIdentifier).toBe('userIdentifier');
    });
  });

  test('userCode로 user 존재 유뮤를 알 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = User.from('userIdentifier');
      user.assignUserCode('A1B2C1D');
      await usersRepository.saveUser(user);

      // when
      const existByUserCode = await usersRepository.existByUserCode('A1B2C1D');
      const nonExistByUserCode =
        await usersRepository.existByUserCode('A1B2C1E');

      // then
      expect(existByUserCode).toBe(true);
      expect(nonExistByUserCode).toBe(false);
    });
  });

  test('userCode로 user를 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = User.from('userIdentifier');
      user.assignUserCode('A1B2C1D');
      await usersRepository.saveUser(user);

      // when
      const findOne = await usersRepository.findOneByUserCode('A1B2C1D');

      // then
      expect(findOne.userCode).toBe('A1B2C1D');
      expect(findOne.userIdentifier).toBe('userIdentifier');
    });
  });

  test('findOneByUserIdentifierWithRoles는 권한정보를 포함하여 user를 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = User.from('userIdentifier');
      user.assignUserCode('A1B2C1D');
      await usersRepository.saveUser(user);

      // when
      const findOne =
        await usersRepository.findOneByUserIdentifierWithRoles(
          'userIdentifier',
        );

      // then
      expect(findOne.userCode).toBe('A1B2C1D');
      expect(findOne.roles.length).toBe(1);
      expect(findOne.roles[0]).toBe(UserRole.MEMBER);
    });
  });

  test('findOneByUserCodeWithRoles 빈값에 대해 빈 값을 반환한다.', async () => {
    await transactionTest(dataSource, async () => {
      // when
      const findOne =
        await usersRepository.findOneByUserIdentifierWithRoles(undefined);

      // then
      expect(findOne).toBeUndefined();
    });
  });

  test('findOneByUserCodeWithRoles는 권한정보를 포함하여 user를 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = User.from('userIdentifier');
      user.assignUserCode('A1B2C1D');
      await usersRepository.saveUser(user);

      // when
      const findOne =
        await usersRepository.findOneByUserCodeWithRoles('A1B2C1D');

      // then
      expect(findOne.userCode).toBe('A1B2C1D');
      expect(findOne.roles.length).toBe(1);
      expect(findOne.roles).toContain(UserRole.MEMBER);
    });
  });

  test('groupId로 그룹에 속한 유저 정보를 조회 할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('Test Group', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);
      const achievement1 = await groupAchievementFixture.createGroupAchievement(
        user1,
        group,
        null,
        'user1 ga1',
      );
      const achievement2 = await groupAchievementFixture.createGroupAchievement(
        user1,
        group,
        null,
        'user1 ga2',
      );
      const achievement3 = await groupAchievementFixture.createGroupAchievement(
        user2,
        group,
        null,
        'user2 ga1',
      );
      // when
      const groupUsers = await usersRepository.findByGroupId(group.id);

      // then
      expect(groupUsers.length).toEqual(2);
      expect(groupUsers[0].userCode).toEqual(user1.userCode);
      expect(groupUsers[0].avatarUrl).toEqual(user1.avatarUrl);
      expect(groupUsers[0].grade).toEqual(UserGroupGrade.LEADER);
      expect(groupUsers[0].lastChallenged).toEqual(
        dateFormat(achievement2.createdAt),
      );
      expect(groupUsers[1].userCode).toEqual(user2.userCode);
      expect(groupUsers[1].avatarUrl).toEqual(user2.avatarUrl);
      expect(groupUsers[1].grade).toEqual(UserGroupGrade.PARTICIPANT);
      expect(groupUsers[1].lastChallenged).toEqual(
        dateFormat(achievement3.createdAt),
      );
    });
  });
});
