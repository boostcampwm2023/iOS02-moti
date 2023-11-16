import { DataSource, QueryFailedError } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { AdminRepository } from './admin.repository';
import { transactionTest } from '../../../test/common/transaction-test';
import { Admin } from '../domain/admin.domain';
import { UserRepository } from '../../users/entities/user.repository';
import { User } from '../../users/domain/user.domain';
import { AdminStatus } from '../domain/admin-status';
import { AdminModule } from '../admin.module';

describe('AdminRepository Test', () => {
  let adminRepository: AdminRepository;
  let userRepository: UserRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        AdminModule,
        ConfigModule.forRoot(configServiceModuleOptions),
      ],
      controllers: [],
      providers: [],
    }).compile();

    adminRepository = app.get<AdminRepository>(AdminRepository);
    userRepository = app.get<UserRepository>(UserRepository);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('테스트 환경 확인', () => {
    it('adminRepository가 정의되어 있어야 한다.', () => {
      expect(adminRepository).toBeDefined();
    });
  });

  it('saveAdmin은 admin을 저장시킬 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = new User();
      user.assignUserCode('ABCEAQ2');
      user.userIdentifier = '123';
      const savedUser = await userRepository.saveUser(user);
      const admin = new Admin(savedUser, 'abc123@abc.com', '1234');

      // when
      const savedAdmin = await adminRepository.saveAdmin(admin);

      // then
      expect(savedAdmin).toBeDefined();
      expect(savedAdmin.email).toBe('abc123@abc.com');
      expect(savedAdmin.status).toBe(AdminStatus.PENDING);
      expect(savedAdmin.user).toBeDefined();
    });
  });

  it('savedAdmin은 영속되지 않은 user는 저장할 수 없다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = new User();
      user.assignUserCode('ABCEAQ2');
      user.userIdentifier = '123';
      const admin = new Admin(user, 'abc123@abc.com', '1234');

      // when
      // then
      await expect(adminRepository.saveAdmin(admin)).rejects.toThrow(
        QueryFailedError,
      );
    });
  });

  it('getUserAdmin은 유저에 대한 admin을 가져올 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = new User();
      user.assignUserCode('ABCEAQ2');
      user.userIdentifier = '123';
      const savedUser = await userRepository.saveUser(user);
      const admin = new Admin(savedUser, 'abc123@abc.com', '1234');
      await adminRepository.saveAdmin(admin);

      // when
      const retrieveAdmin = await adminRepository.getUserAdmin(savedUser);

      // then
      expect(retrieveAdmin).toBeDefined();
      expect(retrieveAdmin.user).toBeUndefined();
      expect(retrieveAdmin.email).toBe('abc123@abc.com');
      expect(retrieveAdmin.status).toBe(AdminStatus.PENDING);
    });
  });

  it('getUserAdmin은 user가 admin으로 저장되어 있지 않을 때 undefined을 반환한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = new User();
      user.assignUserCode('ABCEAQ2');
      user.userIdentifier = '123';
      const savedUser = await userRepository.saveUser(user);

      // when
      const retrieveAdmin = await adminRepository.getUserAdmin(savedUser);

      // then
      expect(retrieveAdmin).toBeUndefined();
    });
  });

  it('getUserAdmin은 user가 저장되지 않은 유저일 때 undefined을 반환한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = new User();
      user.assignUserCode('ABCEAQ2');
      user.userIdentifier = '123';
      user.id = 1;

      // when
      const retrieveAdmin = await adminRepository.getUserAdmin(user);

      // then
      expect(retrieveAdmin).toBeUndefined();
    });
  });

  it('findActiveAdminByEmail은 email으로 ACTIVE 상태의 어드민을 가져올 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = new User();
      user.assignUserCode('ABCEAQ2');
      user.userIdentifier = '123';
      const savedUser = await userRepository.saveUser(user);
      const admin = new Admin(savedUser, 'abc123@abc.com', '1234');
      admin.status = AdminStatus.ACTIVE;
      await adminRepository.saveAdmin(admin);

      // when
      const retrieveAdmin =
        await adminRepository.findActiveAdminByEmail('abc123@abc.com');

      // then
      expect(retrieveAdmin).toBeDefined();
      expect(retrieveAdmin.user).toStrictEqual(savedUser);
      expect(retrieveAdmin.email).toBe('abc123@abc.com');
      expect(retrieveAdmin.status).toBe(AdminStatus.ACTIVE);
    });
  });

  it('findActiveAdminByEmail은 존재하지 않는 email에 대한 admin에 대해 undefined을 반환한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      // when
      const retrieveAdmin =
        await adminRepository.findActiveAdminByEmail('abc123@abc.com');

      // then
      expect(retrieveAdmin).toBeUndefined();
    });
  });

  it('findActiveAdminByEmail은 email으로 PENDING 상태의 어드민을 가져올 수 없다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = new User();
      user.assignUserCode('ABCEAQ2');
      user.userIdentifier = '123';
      const savedUser = await userRepository.saveUser(user);
      const admin = new Admin(savedUser, 'abc123@abc.com', '1234');
      admin.status = AdminStatus.PENDING;
      await adminRepository.saveAdmin(admin);

      // when
      const retrieveAdmin =
        await adminRepository.findActiveAdminByEmail('abc123@abc.com');

      // then
      expect(retrieveAdmin).toBeUndefined();
    });
  });
});
