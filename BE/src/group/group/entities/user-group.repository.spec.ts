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
import { UserGroup } from '../domain/user-group.doamin';

describe('UserGroupRepository Test', () => {
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

  test('userId와 groupId로 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('Test Group', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);

      // when
      const userGroup1 = await userGroupRepository.findOneByUserIdAndGroupId(
        user1.id,
        group.id,
      );
      const userGroup2 = await userGroupRepository.findOneByUserIdAndGroupId(
        user2.id,
        group.id,
      );

      // then
      expect(userGroup1.grade).toEqual(UserGroupGrade.LEADER);
      expect(userGroup1.user.id).toEqual(user1.id);
      expect(userGroup1.user.userCode).toEqual(user1.userCode);
      expect(userGroup1.group.id).toEqual(group.id);
      expect(userGroup2.grade).toEqual(UserGroupGrade.PARTICIPANT);
      expect(userGroup2.user.id).toEqual(user2.id);
      expect(userGroup2.group.id).toEqual(group.id);
    });
  });

  test('userCode와 groupId로 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('Test Group', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);

      // when
      const userGroup1 = await userGroupRepository.findOneByUserCodeAndGroupId(
        user1.userCode,
        group.id,
      );
      const userGroup2 = await userGroupRepository.findOneByUserCodeAndGroupId(
        user2.userCode,
        group.id,
      );

      // then
      expect(userGroup1.grade).toEqual(UserGroupGrade.LEADER);
      expect(userGroup1.user.id).toEqual(user1.id);
      expect(userGroup1.user.userCode).toEqual(user1.userCode);
      expect(userGroup1.group.id).toEqual(group.id);
      expect(userGroup2.grade).toEqual(UserGroupGrade.PARTICIPANT);
      expect(userGroup2.user.id).toEqual(user2.id);
      expect(userGroup2.group.id).toEqual(group.id);
    });
  });

  test('userGruop을 저장할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const group = await groupFixture.createGroup('Test Group', user1);
      const user2 = await usersFixture.getUser('DEF');

      // when
      const userGroup = await userGroupRepository.saveUserGroup(
        new UserGroup(
          user2,
          group,
          UserGroupGrade.PARTICIPANT,
          user2.groupSequence,
        ),
      );

      // then
      expect(userGroup.grade).toEqual(UserGroupGrade.PARTICIPANT);
      expect(userGroup.user.id).toEqual(user2.id);
      expect(userGroup.group.id).toEqual(group.id);
    });
  });
});
