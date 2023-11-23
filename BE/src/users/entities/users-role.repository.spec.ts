import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { UsersRoleRepository } from './users-role.repository';
import { DataSource } from 'typeorm';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { UsersFixture } from '../../../test/user/users-fixture';
import { UserRole } from '../domain/user-role';
import { transactionTest } from '../../../test/common/transaction-test';

describe('UsersRoleRepository test', () => {
  let usersRoleRepository: UsersRoleRepository;
  let usersFixture: UsersFixture;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        UsersTestModule,
        CustomTypeOrmModule.forCustomRepository([UsersRoleRepository]),
      ],
    }).compile();

    usersRoleRepository = module.get<UsersRoleRepository>(UsersRoleRepository);
    usersFixture = module.get<UsersFixture>(UsersFixture);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  test('saveUserRole로 user의 UserRole을 추가할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser(1);

      // when
      const savedUserRole = await usersRoleRepository.saveUserRole(
        user,
        UserRole.ADMIN,
      );

      // then
      expect(savedUserRole).toBe(UserRole.ADMIN);
    });
  });

  test('findUserRole로 user의 UserRole을 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser(1);
      await usersRoleRepository.saveUserRole(user, UserRole.ADMIN);

      // when
      const userRoles = await usersRoleRepository.findUserRole(user);

      // then
      expect(userRoles.length).toBe(2);
      expect(userRoles).toContain(UserRole.ADMIN);
      expect(userRoles).toContain(UserRole.MEMBER);
    });
  });

  test('saveUserRole로 user에게 이미 존재하는 Role을 추가할 수 없다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser(1);
      await usersRoleRepository.saveUserRole(user, UserRole.ADMIN);

      // when
      await usersRoleRepository.saveUserRole(user, UserRole.ADMIN);
      const userRoles = await usersRoleRepository.findUserRole(user);

      // then
      expect(userRoles.length).toBe(2);
      expect(userRoles).toContain(UserRole.MEMBER);
      expect(userRoles).toContain(UserRole.ADMIN);
    });
  });
});
