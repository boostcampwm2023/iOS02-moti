import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { User } from '../domain/user.domain';
import { configServiceModuleOptions } from '../../config/config';
import { UserEntity } from './user.entity';
import { DataSource } from 'typeorm';

describe('UserRepository test', () => {
  let usersRepository: UserRepository;
  let dataSource: DataSource;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([UserRepository]),
      ],
    }).compile();

    usersRepository = module.get<UserRepository>(UserRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await usersRepository.delete({});
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  test('userIdentifier로 user를 조회할 수 있다.', async () => {
    // given
    const user = User.from('userIdentifier');
    user.assignUserCode('A1B2C1D');
    await usersRepository.save(UserEntity.from(user));

    // when
    const findOne =
      await usersRepository.findOneByUserIdentifier('userIdentifier');

    // then
    expect(findOne.userIdentifier).toBe('userIdentifier');
  });

  test('userCode로 user 존재 유뮤를 알 수 있다.', async () => {
    // given
    const user = User.from('userIdentifier');
    user.assignUserCode('A1B2C1D');
    await usersRepository.save(UserEntity.from(user));

    // when
    const existByUserCode = await usersRepository.existByUserCode('A1B2C1D');
    const nonExistByUserCode = await usersRepository.existByUserCode('A1B2C1E');

    // then
    expect(existByUserCode).toBe(true);
    expect(nonExistByUserCode).toBe(false);
  });
});
