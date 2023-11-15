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
});
