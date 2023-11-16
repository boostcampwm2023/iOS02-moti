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
import { UsersModule } from '../../users/users.module';
import { UserRepository } from '../../users/entities/user.repository';
import { transactionTest } from '../../../test/common/transaction-test';
import { User } from '../../users/domain/user.domain';
import { AdminRegister } from '../dto/admin-register';
import { AdminStatus } from '../domain/admin-status';
import { Admin } from '../domain/admin.domain';
import { AdminRepository } from '../entities/admin.repository';
import { AdminLogin } from '../dto/admin-login';
import { AdminInvalidPasswordException } from '../exception/admin-invalid-password';
import { UserAlreadyRegisteredAdmin } from '../exception/user-already-registered-admin';

describe('AdminService Test', () => {
  let adminService: AdminService;
  let passwordEncoder: PasswordEncoder;
  let dataSource: DataSource;
  let userRepository: UserRepository;
  let adminRepository: AdminRepository;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        AdminModule,
        UsersModule,
        ConfigModule.forRoot(configServiceModuleOptions),
      ],
    }).compile();

    userRepository = app.get<UserRepository>(UserRepository);
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
      const user = new User();
      user.assignUserCode('ABCEAQ2');
      user.userIdentifier = '123';
      const savedUser = await userRepository.saveUser(user);

      const adminRegister = new AdminRegister('abc@abc.com', '1234', '1234');

      // when
      const admin = await adminService.registerAdmin(adminRegister, savedUser);

      // then
      expect(admin).toBeDefined();
      expect(admin.status).toBe(AdminStatus.PENDING);
      expect(admin.email).toBe('abc@abc.com');
    });
  });

  it('registerAdmin은 이미 관리자로 등록된 유저의 요청에 UserAlreadyRegisteredAdmin를 발생시킨다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = new User();
      user.assignUserCode('ABCEAQ2');
      user.userIdentifier = '123';
      const savedUser = await userRepository.saveUser(user);
      const savedAdmin = new Admin(savedUser, 'abc123@abc.com', '1234');
      savedAdmin.status = AdminStatus.ACTIVE;
      await adminRepository.saveAdmin(savedAdmin);

      const adminRegister = new AdminRegister('abc@abc.com', '1234', '1234');

      // when
      // then
      await expect(
        adminService.registerAdmin(adminRegister, savedUser),
      ).rejects.toThrow(UserAlreadyRegisteredAdmin);
    });
  });

  it('loginAdmin은 ACTIVE 상태의 어드민이 올바른 email, password 요청에서 인증 토큰을 부여한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = new User();
      user.assignUserCode('ABCEAQ2');
      user.userIdentifier = '123';
      const savedUser = await userRepository.saveUser(user);
      const admin = new Admin(savedUser, 'abc123@abc.com', '1234');
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
      const user = new User();
      user.assignUserCode('ABCEAQ2');
      user.userIdentifier = '123';
      const savedUser = await userRepository.saveUser(user);
      const admin = new Admin(savedUser, 'abc123@abc.com', '1234');
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
