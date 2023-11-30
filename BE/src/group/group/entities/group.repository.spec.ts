import { GroupRepository } from './group.repository';
import { DataSource } from 'typeorm';
import { UsersFixture } from '../../../../test/user/users-fixture';
import { typeOrmModuleOptions } from '../../../config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UsersTestModule } from '../../../../test/user/users-test.module';
import { configServiceModuleOptions } from '../../../config/config';
import { transactionTest } from '../../../../test/common/transaction-test';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { UserGroupGrade } from '../domain/user-group-grade';
import { CustomTypeOrmModule } from '../../../config/typeorm/custom-typeorm.module';
import { UserGroupRepository } from './user-group.repository';
import { GroupTestModule } from '../../../../test/group/group/group-test.module';

describe('GroupRepository Test', () => {
  let groupRepository: GroupRepository;
  let userGroupRepository: UserGroupRepository;
  let groupFixture: GroupFixture;
  let dataSource: DataSource;
  let usersFixture: UsersFixture;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([
          GroupRepository,
          UserGroupRepository,
        ]),
        UsersTestModule,
        GroupTestModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    groupRepository = app.get<GroupRepository>(GroupRepository);
    userGroupRepository = app.get<UserGroupRepository>(UserGroupRepository);
    usersFixture = app.get<UsersFixture>(UsersFixture);
    groupFixture = app.get<GroupFixture>(GroupFixture);
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('테스트 환경 확인', () => {
    it('groupRepository가 정의되어 있어야 한다.', () => {
      expect(groupRepository).toBeDefined();
    });
  });

  test('그룹을 생성하면 생성한 유저가 리더가 된다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const group = GroupFixture.group('Test Group');
      group.addMember(user, UserGroupGrade.LEADER);

      // when
      const savedGroup = await groupRepository.saveGroup(group);
      const userGroup = await userGroupRepository.repository.findOne({
        where: { group: { id: group.id }, user: { id: user.id } },
        relations: {
          group: true,
          user: true,
        },
      });
      // then
      expect(savedGroup.name).toEqual(savedGroup.name);
      expect(userGroup.group.id).toEqual(savedGroup.id);
      expect(userGroup.user.id).toEqual(user.id);
      expect(userGroup.grade).toEqual(UserGroupGrade.LEADER);
    });
  });

  test('그룹 리스트를 조회한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      await groupFixture.createGroup('Test Group1', user);
      await groupFixture.createGroup('Test Group2', user);
      await groupFixture.createGroup('Test Group3', user);

      // when
      const groups = await groupRepository.findByUserId(user.id);

      // then
      expect(groups.length).toEqual(3);
      expect(groups[0].name).toEqual('Test Group1');
      expect(groups[1].name).toEqual('Test Group2');
      expect(groups[2].name).toEqual('Test Group3');
    });
  });

  describe('findGroupByIdAndLeaderUser는 그룹을 찾을 수 있다.', () => {
    it('LEADER는 해당하는 그룹을 반환받는다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(10);
        const managers = await usersFixture.getUsers(10);

        const group = await groupFixture.createGroups(
          leader,
          participants,
          managers,
        );
        // when

        const savedGroup = await groupRepository.findGroupByIdAndLeaderUser(
          leader,
          group.id,
        );

        // then
        expect(savedGroup.name).toEqual(group.name);
      });
    });

    it('MEMBER는 해당하는 그룹을 반환받지 못한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(10);
        const managers = await usersFixture.getUsers(10);

        const group = await groupFixture.createGroups(
          leader,
          participants,
          managers,
        );
        // when

        const savedGroup = await groupRepository.findGroupByIdAndLeaderUser(
          participants[0],
          group.id,
        );

        // then
        expect(savedGroup).toBeUndefined();
      });
    });
  });
});
