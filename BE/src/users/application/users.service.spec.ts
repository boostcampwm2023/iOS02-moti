import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../domain/user.domain';
import { UserRepository } from '../entities/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { UsersModule } from '../users.module';
import { UserRole } from '../domain/user-role';
import { transactionTest } from '../../../test/common/transaction-test';
import { InvalidRejectRequestException } from '../../group/achievement/exception/invalid-reject-request.exception';
import { DataSource } from 'typeorm';
import { UsersFixture } from '../../../test/user/users-fixture';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { NoSuchUserException } from '../exception/no-such-user.exception';

describe('UsersService Test', () => {
  let userService: UsersService;
  let userRepository: UserRepository;
  let usersFixture: UsersFixture;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        ConfigModule.forRoot(configServiceModuleOptions),
        UsersModule,
        UsersTestModule,
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    usersFixture = module.get<UsersFixture>(UsersFixture);
    dataSource = module.get<DataSource>(DataSource);
  });

  test('userService, userRepository가 정의되어 있어야 한다. ', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  test('userCode로 user를 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      const user = User.from('userIdentifier');
      user.assignUserCode('A1B2C1D');
      await userRepository.saveUser(user);

      // when
      const findOne = await userService.findOneByUserCode('A1B2C1D');

      // then
      expect(findOne.userCode).toBe('A1B2C1D');
      expect(findOne.userIdentifier).toBe('userIdentifier');
    });
  });

  test('getUserByUserCodeWithRoles는 권한 정보가 포함된 유저를 userCode로 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      const user = User.from('userIdentifier');
      user.assignUserCode('A1B2C1D');
      await userRepository.saveUser(user);

      // when
      const findOne = await userService.getUserByUserCodeWithRoles('A1B2C1D');

      // then
      expect(findOne.userCode).toBe('A1B2C1D');
      expect(findOne.userIdentifier).toBe('userIdentifier');
      expect(findOne.roles).toHaveLength(1);
      expect(findOne.roles).toContain(UserRole.MEMBER);
    });
  });

  test('특정 유저를 차단할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');

      // when
      const rejectUserResponse = await userService.reject(
        user1,
        user2.userCode,
      );

      // then
      expect(rejectUserResponse.userCode).toEqual(user1.userCode);
      expect(rejectUserResponse.blockedUserCode).toEqual(user2.userCode);
    });
  });

  test('존재하지 않는 유저를 차단하려고 하면 NoSuchUserException를 던진다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const invalidUserCode = 'XYZ1234';

      // when
      // then
      await expect(userService.reject(user1, invalidUserCode)).rejects.toThrow(
        NoSuchUserException,
      );
    });
  });

  test('자신이 자신을 차단하려고 하면 InvalidRejectRequestException를 던진다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');

      // when
      // then
      await expect(userService.reject(user1, user1.userCode)).rejects.toThrow(
        InvalidRejectRequestException,
      );
    });
  });
});
