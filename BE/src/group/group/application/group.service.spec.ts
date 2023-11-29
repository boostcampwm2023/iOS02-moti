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

describe('GroupSerivce Test', () => {
  let groupService: GroupService;
  let userGroupRepository: UserGroupRepository;
  let usersFixture: UsersFixture;
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
      ],
      providers: [],
    }).compile();

    groupService = module.get<GroupService>(GroupService);
    userGroupRepository = module.get<UserGroupRepository>(UserGroupRepository);
    usersFixture = module.get<UsersFixture>(UsersFixture);
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
});
