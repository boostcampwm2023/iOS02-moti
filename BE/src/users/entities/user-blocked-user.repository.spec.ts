import { UserBlockedUserRepository } from './user-blocked-user.repository';
import { UsersFixture } from '../../../test/user/users-fixture';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { DataSource } from 'typeorm';
import { configServiceModuleOptions } from '../../config/config';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { transactionTest } from '../../../test/common/transaction-test';
import { UserBlockedUser } from '../domain/user-blocked-user.domain';

describe('UserBlockedUserRepository Test', () => {
  let userBlockedUserRepository: UserBlockedUserRepository;
  let usersFixture: UsersFixture;
  let dataSource: DataSource;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([UserBlockedUserRepository]),
        UsersTestModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    userBlockedUserRepository = app.get<UserBlockedUserRepository>(
      UserBlockedUserRepository,
    );
    usersFixture = app.get<UsersFixture>(UsersFixture);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  test('특정 유저가 차단한 유저 정보를 저장한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');

      // when
      const saved = await userBlockedUserRepository.saveUserBlockedUser(
        new UserBlockedUser(user1, user2),
      );

      // then
      expect(saved.user.id).toEqual(user1.id);
      expect(saved.blockedUser.id).toEqual(user2.id);
    });
  });

  test('차단한 유저 목록을 조회한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const user3 = await usersFixture.getUser('GHI');
      await userBlockedUserRepository.saveUserBlockedUser(
        new UserBlockedUser(user1, user2),
      );
      await userBlockedUserRepository.saveUserBlockedUser(
        new UserBlockedUser(user1, user3),
      );

      // when
      const userBlockedUsers =
        await userBlockedUserRepository.findByUserIdWithBlockedUser(user1.id);

      // then
      expect(userBlockedUsers.length).toEqual(2);
    });
  });

  test('차단 요청 userId, 차단 대상 userCode로 차단 정보를 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      await userBlockedUserRepository.saveUserBlockedUser(
        new UserBlockedUser(user1, user2),
      );

      // when
      const userBlockedUser =
        await userBlockedUserRepository.findByUserIdAndBlockedUserCode(
          user1.id,
          user2.userCode,
        );

      // then
      expect(userBlockedUser.user.id).toEqual(user1.id);
      expect(userBlockedUser.blockedUser.id).toEqual(user2.id);
    });
  });

  test('유저차단을 해제한다.', async () => {
    // await transactionTest(dataSource, async () => {
    // given
    const user1 = await usersFixture.getUser('ABC');
    const user2 = await usersFixture.getUser('DEF');
    await userBlockedUserRepository.saveUserBlockedUser(
      new UserBlockedUser(user1, user2),
    );

    // when
    await userBlockedUserRepository.deleteByUserIdAndBlockedUserId(
      user1.id,
      user2.id,
    );

    // then
    const expected =
      await userBlockedUserRepository.findByUserIdAndBlockedUserCode(
        user1.id,
        user2.userCode,
      );
    expect(expected).toBeUndefined();
  });
});
