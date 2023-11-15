import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../domain/user.domain';
import { UserRepository } from '../entities/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../config/config';
import { UsersModule } from '../users.module';

describe('UsersService Test', () => {
  let userService: UsersService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        UsersModule,
        ConfigModule.forRoot(configServiceModuleOptions),
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  test('userService, userRepository가 정의되어 있어야 한다. ', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  test('userCode로 user를 조회할 수 있다.', async () => {
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
