import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GroupRepository } from '../entities/group.repository';
import { GroupCodeGenerator } from './group-code-generator';
import { configServiceModuleOptions } from '../../../config/config';
import { typeOrmModuleOptions } from '../../../config/typeorm';
import { CustomTypeOrmModule } from '../../../config/typeorm/custom-typeorm.module';

describe('GroupCodeGenerator test', () => {
  let groupRepository: GroupRepository;
  let groupCodeGenerator: GroupCodeGenerator;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([GroupRepository]),
      ],
    }).compile();

    groupRepository = module.get<GroupRepository>(GroupRepository);
    groupCodeGenerator = new GroupCodeGenerator(groupRepository);
  });

  it('사용할 모듈이 정의가 되어있어야한다.', () => {
    expect(groupRepository).toBeDefined();
    expect(groupCodeGenerator).toBeDefined();
  });

  test('영대문자, 숫자를 포함한 임의의 7글자 문자열을 생성한다.', async () => {
    const groupCode = await groupCodeGenerator.generate();
    expect(groupCode.length).toEqual(7);
  });
});
