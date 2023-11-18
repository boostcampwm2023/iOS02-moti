import { AdminService } from './admin.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { DataSource } from 'typeorm';
import { AdminModule } from '../admin.module';
import { PlainTextPasswordEncoder } from './plain-text-password-encoder';
import { PasswordEncoder } from './password-encoder';
import { transactionTest } from '../../../test/common/transaction-test';
import { AdminRegister } from '../dto/admin-register';
import { AdminStatus } from '../domain/admin-status';
import { Admin } from '../domain/admin.domain';
import { AdminRepository } from '../entities/admin.repository';
import { AdminLogin } from '../dto/admin-login';
import { AdminInvalidPasswordException } from '../exception/admin-invalid-password.exception';
import { UserAlreadyRegisteredAdminException } from '../exception/user-already-registered-admin.exception';
import { UsersTestModule } from '../../../test/user/users-test.module';
import { UsersFixture } from '../../../test/user/users-fixture';

describe('AdminService Test', () => {
  let adminService: AdminService;
  let passwordEncoder: PasswordEncoder;
  let dataSource: DataSource;
  let usersFixture: UsersFixture;
  let adminRepository: AdminRepository;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        AdminModule,
        UsersTestModule,
        ConfigModule.forRoot(configServiceModuleOptions),
      ],
    }).compile();

    usersFixture = app.get<UsersFixture>(UsersFixture);
    adminRepository = app.get<AdminRepository>(AdminRepository);
    adminService = app.get<AdminService>(AdminService);
    passwordEncoder = app.get<PasswordEncoder>(PasswordEncoder);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('adminService가 정의되어 있어야 한다.', () => {
    expect(adminService).toBeDefined();
    expect(passwordEncoder).toBeInstanceOf(PlainTextPasswordEncoder);
  });

  it('registerAdmin은 관리자로 등록 신청한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');

      const adminRegister = new AdminRegister('abc@abc.com', '1234', '1234');

      // when
      const admin = await adminService.registerAdmin(adminRegister, user);

      // then
      expect(admin).toBeDefined();
      expect(admin.status).toBe(AdminStatus.PENDING);
      expect(admin.email).toBe('abc@abc.com');
    });
  });

  it('registerAdmin은 이미 관리자로 등록된 유저의 요청에 UserAlreadyRegisteredAdmin를 발생시킨다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const savedAdmin = new Admin(user, 'abc123@abc.com', '1234');
      savedAdmin.status = AdminStatus.ACTIVE;
      await adminRepository.saveAdmin(savedAdmin);

      const adminRegister = new AdminRegister('abc@abc.com', '1234', '1234');

      // when
      // then
      await expect(
        adminService.registerAdmin(adminRegister, user),
      ).rejects.toThrow(UserAlreadyRegisteredAdminException);
    });
  });

  it('loginAdmin은 ACTIVE 상태의 어드민이 올바른 email, password 요청에서 인증 토큰을 부여한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const admin = new Admin(user, 'abc123@abc.com', '1234');
      admin.status = AdminStatus.ACTIVE;
      await adminRepository.saveAdmin(admin);
      const adminLogin = new AdminLogin('abc123@abc.com', '1234');

      // when
      const token = await adminService.loginAdmin(adminLogin);

      // then
      expect(token).toBeDefined();
    });
  });

  it('loginAdmin은 ACTIVE 상태의 어드민이 올바르지 않은 email, password에서 AdminInvalidPasswordException를 발생', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const admin = new Admin(user, 'abc123@abc.com', '1234');
      admin.status = AdminStatus.ACTIVE;
      await adminRepository.saveAdmin(admin);
      const adminLogin = new AdminLogin('abc123@abc.com', '12345');

      // when
      // then
      await expect(adminService.loginAdmin(adminLogin)).rejects.toThrow(
        AdminInvalidPasswordException,
      );
    });
  });
});
