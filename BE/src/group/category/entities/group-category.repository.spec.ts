import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../../config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../../config/typeorm';
import { GroupCategoryRepository } from './group-category.repository';
import { GroupTestModule } from '../../../../test/group/group/group-test.module';
import { DataSource } from 'typeorm';
import { UsersTestModule } from '../../../../test/user/users-test.module';
import { UsersFixture } from '../../../../test/user/users-fixture';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { GroupCategoryModule } from '../group-category.module';
import { GroupCategory } from '../domain/group.category';
import { transactionTest } from '../../../../test/common/transaction-test';
import { CustomTypeOrmModule } from '../../../config/typeorm/custom-typeorm.module';

describe('GroupCategoryRepository test', () => {
  let groupCategoryRepository: GroupCategoryRepository;
  let userFixture: UsersFixture;
  let groupFixture: GroupFixture;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([GroupCategoryRepository]),
        GroupTestModule,
        UsersTestModule,
        GroupCategoryModule,
      ],
    }).compile();

    userFixture = module.get<UsersFixture>(UsersFixture);
    groupFixture = module.get<GroupFixture>(GroupFixture);
    groupCategoryRepository = module.get<GroupCategoryRepository>(
      GroupCategoryRepository,
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('테스트 환경 구성', () => {
    it('groupCategoryRepository를 주입할 수 있다.', () => {
      expect(groupCategoryRepository).toBeDefined();
    });
  });

  describe('saveGroupCategory는 그룹 카테고리를 저장할 수 있다.', () => {
    it('그룹 카테고리를 생성할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await userFixture.getUser('ABC');
        const group = await groupFixture.getGroup(user);
        const groupCategory = new GroupCategory(user, group, '카테고리1');

        // when
        const saved =
          await groupCategoryRepository.saveGroupCategory(groupCategory);

        // then
        expect(saved).toBeInstanceOf(GroupCategory);
        expect(saved.name).toEqual('카테고리1');
        expect(saved.group).toEqual(group);
        expect(saved.user).toEqual(user);
      });
    });
  });
});
