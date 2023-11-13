import { Test, TestingModule } from '@nestjs/testing';
import { CustomTypeOrmModule } from '../../config/typeorm/custom-typeorm.module';
import { UserRepository } from '../../users/entities/user.repository';
import { UserCodeGenerator } from './user-code-generator';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../config/typeorm';
import { configServiceModuleOptions } from '../../config/config';

describe('UserCodeGenerator test', () => {
  let userRepository: UserRepository;
  let userCodeGenerator: UserCodeGenerator;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([UserRepository]),
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userCodeGenerator = new UserCodeGenerator(userRepository);
  });

  it('사용할 모듈이 정의가 되어있어야한다.', () => {
    expect(userRepository).toBeDefined();
    expect(userCodeGenerator).toBeDefined();
  });

  test('영대문자, 숫자를 포함한 임의의 7글자 문자열을 생성한다.', async () => {
    const userCode = await userCodeGenerator.generate();
    expect(userCode.length).toEqual(7);
  });
});
