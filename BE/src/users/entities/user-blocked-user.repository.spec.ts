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
});
