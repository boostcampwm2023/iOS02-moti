import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../../config/typeorm';
import { UsersTestModule } from '../../../../test/user/users-test.module';
import { OperateModule } from '../../../operate/operate.module';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../../config/config';
import { UsersFixture } from '../../../../test/user/users-fixture';
import { DataSource } from 'typeorm';
import { GroupTestModule } from '../../../../test/group/group/group-test.module';
import { GroupCategoryModule } from '../group-category.module';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { GroupCategoryService } from './group-category.service';
import { transactionTest } from '../../../../test/common/transaction-test';
import { GroupCategoryCreate } from '../dto/group-category-create';
import { UnauthorizedGroupCategoryException } from '../exception/unauthorized-group-category.exception';

describe('GroupCategoryService test', () => {
  let groupCategoryService: GroupCategoryService;
  let dataSource: DataSource;
  let usersFixture: UsersFixture;
  let groupFixture: GroupFixture;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        UsersTestModule,
        OperateModule,
        ConfigModule.forRoot(configServiceModuleOptions),
        GroupTestModule,
        GroupCategoryModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    groupFixture = app.get<GroupFixture>(GroupFixture);
    usersFixture = app.get<UsersFixture>(UsersFixture);
    groupCategoryService = app.get<GroupCategoryService>(GroupCategoryService);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('테스트 환경 확인', () => {
    it('groupCategoryService가 정의되어 있어야 한다.', () => {
      expect(groupCategoryService).toBeDefined();
    });
  });

  describe('saveGroupCategory는 그룹 카테고리를 저장할 수 있다.', () => {
    it('그룹장은 그룹 카테고리를 생성할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const group = await groupFixture.getGroup(leader);

        const groupCategoryCreate = new GroupCategoryCreate('카테고리1');

        // when
        const savedGroupCategory =
          await groupCategoryService.createGroupCategory(
            leader,
            group.id,
            groupCategoryCreate,
          );

        // then
        expect(savedGroupCategory.name).toBe('카테고리1');
        expect(savedGroupCategory.group.id).toEqual(group.id);
      });
    });

    it('그룹 멤버는 카테고리를 생성할 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(5);

        const group = await groupFixture.getGroup(leader, participants);

        const groupCategoryCreate = new GroupCategoryCreate('카테고리1');

        // when
        // then
        await expect(
          groupCategoryService.createGroupCategory(
            participants[0],
            group.id,
            groupCategoryCreate,
          ),
        ).rejects.toThrow(UnauthorizedGroupCategoryException);
      });
    });

    it('그룹 관리자는 카테고리를 생성할 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(5);
        const managers = await usersFixture.getUsers(5);

        const group = await groupFixture.getGroup(
          leader,
          participants,
          managers,
        );

        const groupCategoryCreate = new GroupCategoryCreate('카테고리1');

        // when
        // then
        await expect(
          groupCategoryService.createGroupCategory(
            managers[0],
            group.id,
            groupCategoryCreate,
          ),
        ).rejects.toThrow(UnauthorizedGroupCategoryException);
      });
    });
  });
});
