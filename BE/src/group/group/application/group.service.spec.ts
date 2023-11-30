import { GroupService } from './group.service';
import { GroupRepository } from '../entities/group.repository';
import { UsersFixture } from '../../../../test/user/users-fixture';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomTypeOrmModule } from '../../../config/typeorm/custom-typeorm.module';
import { configServiceModuleOptions } from '../../../config/config';
import { typeOrmModuleOptions } from '../../../config/typeorm';
import { UsersTestModule } from '../../../../test/user/users-test.module';
import { CreateGroupRequest } from '../dto/create-group-request.dto';
import { GroupModule } from '../group.module';
import { UserGroupRepository } from '../entities/user-group.repository';
import { UserGroupGrade } from '../domain/user-group-grade';
import { transactionTest } from '../../../../test/common/transaction-test';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { GroupTestModule } from '../../../../test/group/group/group-test.module';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { GroupAchievementTestModule } from '../../../../test/group/achievement/group-achievement-test.module';
import { GroupCategoryTestModule } from '../../../../test/group/category/group-category-test.module';
import { dateFormat } from '../../../common/utils/date-formatter';

describe('GroupSerivce Test', () => {
  let groupService: GroupService;
  let userGroupRepository: UserGroupRepository;
  let usersFixture: UsersFixture;
  let groupFixture: GroupFixture;
  let groupAchievementFixture: GroupAchievementFixture;
  let groupCategoryFixture: GroupCategoryFixture;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([
          GroupRepository,
          UserGroupRepository,
        ]),
        GroupModule,
        UsersTestModule,
        GroupTestModule,
        GroupAchievementTestModule,
        GroupCategoryTestModule,
      ],
      providers: [],
    }).compile();

    groupService = module.get<GroupService>(GroupService);
    userGroupRepository = module.get<UserGroupRepository>(UserGroupRepository);
    usersFixture = module.get<UsersFixture>(UsersFixture);
    groupFixture = module.get<GroupFixture>(GroupFixture);
    groupAchievementFixture = module.get<GroupAchievementFixture>(
      GroupAchievementFixture,
    );
    groupCategoryFixture =
      module.get<GroupCategoryFixture>(GroupCategoryFixture);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  test('그룹을 생성할 수 있다.', async () => {
    // given
    await transactionTest(dataSource, async () => {
      const user = await usersFixture.getUser('ABC');

      const createGroupRequest = new CreateGroupRequest(
        'Group Name',
        'avatarUrl',
      );
      // when
      const groupResponse = await groupService.create(user, createGroupRequest);
      const userGroup = await userGroupRepository.repository.findOne({
        where: { group: { id: groupResponse.id }, user: { id: user.id } },
        relations: {
          group: true,
          user: true,
        },
      });

      // then
      expect(groupResponse.name).toEqual('Group Name');
      expect(groupResponse.avatarUrl).toEqual('avatarUrl');
      expect(userGroup.group.id).toEqual(groupResponse.id);
      expect(userGroup.user.id).toEqual(user.id);
      expect(userGroup.grade).toEqual(UserGroupGrade.LEADER);
    });
  });

  test('내가 속한 그룹 리스트를 조회할 수 있다.', async () => {
    // given
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const group1 = await groupFixture.createGroup('Test Group1', user);
      const group2 = await groupFixture.createGroup('Test Group2', user);
      const group1Category = await groupCategoryFixture.createCategory(
        user,
        group1,
        'category1',
      );
      await groupAchievementFixture.createGroupAchievement(
        user,
        group1,
        group1Category,
        'achievement',
      );
      const lastChallenged =
        await groupAchievementFixture.createGroupAchievement(
          user,
          group1,
          group1Category,
          'achievement2',
        );

      // when
      const groupListResponse = await groupService.getGroups(user.id);

      // then
      expect(groupListResponse.data.length).toEqual(2);
      expect(groupListResponse.data[0].name).toEqual('Test Group1');
      expect(groupListResponse.data[0].continued).toEqual(2);
      expect(groupListResponse.data[0].lastChallenged).toEqual(
        dateFormat(lastChallenged.createdAt),
      );
      expect(groupListResponse.data[1].name).toEqual('Test Group2');
      expect(groupListResponse.data[1].continued).toEqual(0);
      expect(groupListResponse.data[1].lastChallenged).toEqual(null);
    });
  });

  test('내가 속한 그룹 리스트가 없는 경우 빈 배열을 반환한다.', async () => {
    // given
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      // when
      const groupListResponse = await groupService.getGroups(user.id);
      // then
      expect(groupListResponse.data.length).toEqual(0);
    });
  });
});
