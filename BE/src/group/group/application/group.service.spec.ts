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
import { LeaderNotAllowedToLeaveException } from '../exception/leader-not-allowed-to-leave.exception';
import { NoSuchUserGroupException } from '../exception/no-such-user-group.exception';
import { InviteGroupRequest } from '../dto/invite-group-request.dto';
import { InvitePermissionDeniedException } from '../exception/invite-permission-denied.exception';

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

  test('avatarUrl 없이 그룹을 생성할 수 있다.', async () => {
    // given
    await transactionTest(dataSource, async () => {
      const user = await usersFixture.getUser('ABC');
      const createGroupRequest = new CreateGroupRequest('Group Name');

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
      expect(groupResponse.avatarUrl).not.toBeNull();
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

  test('내가 속한 그룹에서 탈퇴할 수 있다.', async () => {
    // given
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('Test Group', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);

      // when
      const groupLeaveResponse = await groupService.removeUser(
        user2.id,
        group.id,
      );
      // then
      expect(groupLeaveResponse.groupId).toEqual(group.id);
      expect(groupLeaveResponse.userId).toEqual(user2.id);
    });
  });
  test('리더가 탈퇴 시도를 하는 경우에는 LeaderNotAllowedToLeaveException를 던진다.', async () => {
    // given
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('Test Group', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);

      // when
      // then
      await expect(groupService.removeUser(user1.id, group.id)).rejects.toThrow(
        LeaderNotAllowedToLeaveException,
      );
    });
  });
  test('내가 속한 그룹이 아닌 그룹에 대한 탈퇴 시도에 대해서는 NoSuchUserGroupException 예외를 던진다.', async () => {
    // given
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const user3 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('Test Group', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);

      // when
      // then
      await expect(groupService.removeUser(user3.id, group.id)).rejects.toThrow(
        NoSuchUserGroupException,
      );
    });
  });

  test('리더는 다른 그룹원을 초대할 수 있다.', async () => {
    // given
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('GHI');
      const group = await groupFixture.createGroup('Test Group', user1);

      // when
      const inviteGroupResponse = await groupService.invite(
        user1,
        group.id,
        new InviteGroupRequest(user2.userCode),
      );

      // then
      expect(inviteGroupResponse.groupId).toEqual(group.id);
      expect(inviteGroupResponse.userCode).toEqual(user2.userCode);
    });
  });
  test('매니저는 다른 그룹원을 초대할 수 있다.', async () => {
    // given
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('Test Group', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.MANAGER);
      const user3 = await usersFixture.getUser('GHI');

      // when
      const inviteGroupResponse = await groupService.invite(
        user2,
        group.id,
        new InviteGroupRequest(user3.userCode),
      );

      // then
      expect(inviteGroupResponse.groupId).toEqual(group.id);
      expect(inviteGroupResponse.userCode).toEqual(user3.userCode);
    });
  });
  test('일반 멤버가 초대 요청을 하면 InvitePermissionDeniedException을 던진다.', async () => {
    // given
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('Test Group', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);
      const user3 = await usersFixture.getUser('GHI');

      // when
      // then
      await expect(
        groupService.invite(
          user2,
          group.id,
          new InviteGroupRequest(user3.userCode),
        ),
      ).rejects.toThrow(InvitePermissionDeniedException);
    });
  });
  test('자신이 속하지 않은 그룹에 대해서 초대를 요청하면 NoSuchUserGroupException을 던진다.', async () => {
    // given
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group1 = await groupFixture.createGroup('Test Group', user1);
      const group2 = await groupFixture.createGroup('Test Group2', user2);
      const user3 = await usersFixture.getUser('GHI');

      // when
      // then
      await expect(
        groupService.invite(
          user1,
          group2.id,
          new InviteGroupRequest(user3.userCode),
        ),
      ).rejects.toThrow(NoSuchUserGroupException);
    });
  });
});
