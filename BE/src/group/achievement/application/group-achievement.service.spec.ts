import { UsersFixture } from '../../../../test/user/users-fixture';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configServiceModuleOptions } from '../../../config/config';
import { typeOrmModuleOptions } from '../../../config/typeorm';
import { UsersTestModule } from '../../../../test/user/users-test.module';
import { transactionTest } from '../../../../test/common/transaction-test';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { GroupTestModule } from '../../../../test/group/group/group-test.module';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { GroupAchievementTestModule } from '../../../../test/group/achievement/group-achievement-test.module';
import { GroupCategoryTestModule } from '../../../../test/group/category/group-category-test.module';
import { GroupAchievementService } from './group-achievement.service';
import { GroupAchievementModule } from '../group-achievement.module';
import { UserGroupGrade } from '../../group/domain/user-group-grade';
import { NoSuchGroupAchievementException } from '../exception/no-such-group-achievement.exception';
import { InvalidRejectRequestException } from '../exception/invalid-reject-request.exception';
import { ImageTestModule } from '../../../../test/image/image-test.module';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';
import { GroupAchievementCreateRequest } from '../dto/group-achievement-create-request';
import { ImageFixture } from '../../../../test/image/image-fixture';
import { NoSuchGroupUserException } from '../exception/no-such-group-user.exception';
import { NoUserImageException } from '../../../achievement/exception/no-user-image-exception';
import { UnauthorizedAchievementException } from '../../../achievement/exception/unauthorized-achievement.exception';
import { PaginateAchievementRequest } from '../../../achievement/dto/paginate-achievement-request';
import { PaginateGroupAchievementRequest } from '../dto/paginate-group-achievement-request';
import { UsersService } from '../../../users/application/users.service';
import { UsersModule } from '../../../users/users.module';

describe('GroupAchievementService Test', () => {
  let groupAchievementService: GroupAchievementService;
  let userService: UsersService;
  let usersFixture: UsersFixture;
  let groupFixture: GroupFixture;
  let groupAchievementFixture: GroupAchievementFixture;
  let groupCategoryFixture: GroupCategoryFixture;
  let imageFixture: ImageFixture;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        GroupAchievementModule,
        UsersModule,
        GroupCategoryTestModule,
        ImageTestModule,
        UsersTestModule,
        GroupTestModule,
        GroupAchievementTestModule,
        GroupCategoryTestModule,
      ],
      providers: [],
    }).compile();

    groupAchievementService = module.get<GroupAchievementService>(
      GroupAchievementService,
    );
    userService = module.get<UsersService>(UsersService);
    imageFixture = module.get<ImageFixture>(ImageFixture);
    groupCategoryFixture =
      module.get<GroupCategoryFixture>(GroupCategoryFixture);
    usersFixture = module.get<UsersFixture>(UsersFixture);
    groupFixture = module.get<GroupFixture>(GroupFixture);
    groupAchievementFixture = module.get<GroupAchievementFixture>(
      GroupAchievementFixture,
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  test('그룹내 특정 달성기록을 차단할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('GROUP', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);
      const groupAchievement =
        await groupAchievementFixture.createGroupAchievement(
          user2,
          group,
          null,
          'title',
        );

      // when
      const rejectGroupAchievementResponse =
        await groupAchievementService.reject(
          user1,
          group.id,
          groupAchievement.id,
        );

      // then
      expect(rejectGroupAchievementResponse.userId).toEqual(user1.id);
      expect(rejectGroupAchievementResponse.groupAchievementId).toEqual(
        groupAchievement.id,
      );
    });
  });

  test('그룹내 존재하지 않는 달성기록을 차단하려고 하면 NoSuchGroupAchievementException를 던진다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('GROUP', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);
      const groupAchievement =
        await groupAchievementFixture.createGroupAchievement(
          user2,
          group,
          null,
          'title',
        );

      // when
      // then
      await expect(
        groupAchievementService.reject(
          user1,
          group.id,
          groupAchievement.id + 1,
        ),
      ).rejects.toThrow(NoSuchGroupAchievementException);
    });
  });

  test('다른 그룹의 달성기록을 차단하려고 하면 NoSuchGroupAchievementException를 던진다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group1 = await groupFixture.createGroup('GROUP1', user1);
      const group2 = await groupFixture.createGroup('GROUP2', user2);
      const group2Achievement =
        await groupAchievementFixture.createGroupAchievement(
          user2,
          group2,
          null,
          'title',
        );

      // when
      // then
      await expect(
        groupAchievementService.reject(user1, group1.id, group2Achievement.id),
      ).rejects.toThrow(InvalidRejectRequestException);
    });
  });

  describe('create는 그룹내 달성기록을 생성할 수 있다.', () => {
    it('사용자는 그룹내 달성기록을 생성할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user1 = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroup('GROUP', user1);
        const groupCategory = await groupCategoryFixture.createCategory(
          user1,
          group,
          'category',
        );
        const image = await imageFixture.getImage(user1, 'image');

        const groupAchievementCreateRequest = new GroupAchievementCreateRequest(
          '제목',
          '내용',
          groupCategory.id,
          image.id,
        );

        // when
        const groupAchievementResponse = await groupAchievementService.create(
          user1,
          group.id,
          groupAchievementCreateRequest,
        );

        // then
        expect(groupAchievementResponse.id).toBeDefined();
        expect(groupAchievementResponse.title).toEqual('제목');
        expect(groupAchievementResponse.content).toEqual('내용');
        expect(groupAchievementResponse.category.id).toEqual(groupCategory.id);
        expect(groupAchievementResponse.category.achieveCount).toEqual(1);
        expect(groupAchievementResponse.category.name).toEqual('category');
        expect(groupAchievementResponse.userCode).toEqual(user1.userCode);
        expect(groupAchievementResponse.imageUrl).toEqual(image.imageUrl);
        expect(groupAchievementResponse.createdAt).toBeDefined();
      });
    });

    it('사용자는 그룹내 달성기록을 생성할 때 카테고리를 미설정하고 달성기록을 생성할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user1 = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroup('GROUP', user1);
        const image = await imageFixture.getImage(user1, 'image');

        const groupAchievementCreateRequest = new GroupAchievementCreateRequest(
          '제목',
          '내용',
          -1,
          image.id,
        );

        // when
        const groupAchievementResponse = await groupAchievementService.create(
          user1,
          group.id,
          groupAchievementCreateRequest,
        );

        // then
        expect(groupAchievementResponse.id).toBeDefined();
        expect(groupAchievementResponse.title).toEqual('제목');
        expect(groupAchievementResponse.content).toEqual('내용');
        expect(groupAchievementResponse.category.id).toEqual(-1);
        expect(groupAchievementResponse.category.achieveCount).toEqual(1);
        expect(groupAchievementResponse.category.name).toEqual('미설정');
        expect(groupAchievementResponse.userCode).toEqual(user1.userCode);
        expect(groupAchievementResponse.imageUrl).toEqual(image.imageUrl);
        expect(groupAchievementResponse.createdAt).toBeDefined();
      });
    });

    it('사용자가 속하지 않은 그룹에 달성기록 생성 요청에는 NoSuchGroupUserException를 발생시킨다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const groupOwner = await usersFixture.getUser('DEF');
        const group = await groupFixture.createGroup('GROUP', groupOwner);

        const user = await usersFixture.getUser('ABC');
        const image = await imageFixture.getImage(user, 'image');

        const groupAchievementCreateRequest = new GroupAchievementCreateRequest(
          '제목',
          '내용',
          -1,
          image.id,
        );

        // when
        // then
        await expect(
          groupAchievementService.create(
            user,
            group.id,
            groupAchievementCreateRequest,
          ),
        ).rejects.toThrow(NoSuchGroupUserException);
      });
    });

    it('사용자 소유의 이미지가 이닌 달성기록 생성 요청에 NoUserImageException를 발생시킨다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const imageOwner = await usersFixture.getUser('DEF');
        const image = await imageFixture.getImage(imageOwner, 'image');
        const user = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroup('GROUP', user);

        const groupAchievementCreateRequest = new GroupAchievementCreateRequest(
          '제목',
          '내용',
          -1,
          image.id,
        );

        // when
        // then
        await expect(
          groupAchievementService.create(
            user,
            group.id,
            groupAchievementCreateRequest,
          ),
        ).rejects.toThrow(NoUserImageException);
      });
    });

    it('그룹에 속한 사용자는 그룹내 달성기록을 생성할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroup('GROUP', leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          'category',
        );

        const user = await usersFixture.getUser('DEF');
        await groupFixture.addMember(group, user, UserGroupGrade.PARTICIPANT);
        const image = await imageFixture.getImage(user, 'image');

        const groupAchievementCreateRequest = new GroupAchievementCreateRequest(
          '제목',
          '내용',
          groupCategory.id,
          image.id,
        );

        // when
        const groupAchievementResponse = await groupAchievementService.create(
          user,
          group.id,
          groupAchievementCreateRequest,
        );

        // then
        expect(groupAchievementResponse.id).toBeDefined();
        expect(groupAchievementResponse.title).toEqual('제목');
        expect(groupAchievementResponse.content).toEqual('내용');
        expect(groupAchievementResponse.category.id).toEqual(groupCategory.id);
        expect(groupAchievementResponse.category.achieveCount).toEqual(1);
        expect(groupAchievementResponse.category.name).toEqual('category');
        expect(groupAchievementResponse.userCode).toEqual(user.userCode);
        expect(groupAchievementResponse.imageUrl).toEqual(image.imageUrl);
        expect(groupAchievementResponse.createdAt).toBeDefined();
      });
    });

    it('그룹에 속한 사용자는 그룹내 달성기록을 생성할 때 카테고리를 미설정하고 달성기록을 생성할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroup('GROUP', leader);

        const user = await usersFixture.getUser('DEF');
        await groupFixture.addMember(group, user, UserGroupGrade.PARTICIPANT);
        const image = await imageFixture.getImage(user, 'image');

        const groupAchievementCreateRequest = new GroupAchievementCreateRequest(
          '제목',
          '내용',
          -1,
          image.id,
        );

        // when
        const groupAchievementResponse = await groupAchievementService.create(
          user,
          group.id,
          groupAchievementCreateRequest,
        );

        // then
        expect(groupAchievementResponse.id).toBeDefined();
        expect(groupAchievementResponse.title).toEqual('제목');
        expect(groupAchievementResponse.content).toEqual('내용');
        expect(groupAchievementResponse.category.id).toEqual(-1);
        expect(groupAchievementResponse.category.achieveCount).toEqual(1);
        expect(groupAchievementResponse.category.name).toEqual('미설정');
        expect(groupAchievementResponse.userCode).toEqual(user.userCode);
        expect(groupAchievementResponse.imageUrl).toEqual(image.imageUrl);
        expect(groupAchievementResponse.createdAt).toBeDefined();
      });
    });

    it('그룹에 속한 관리자는 그룹내 달성기록을 생성할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroup('GROUP', leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          'category',
        );

        const user = await usersFixture.getUser('DEF');
        await groupFixture.addMember(group, user, UserGroupGrade.MANAGER);
        const image = await imageFixture.getImage(user, 'image');

        const groupAchievementCreateRequest = new GroupAchievementCreateRequest(
          '제목',
          '내용',
          groupCategory.id,
          image.id,
        );

        // when
        const groupAchievementResponse = await groupAchievementService.create(
          user,
          group.id,
          groupAchievementCreateRequest,
        );

        // then
        expect(groupAchievementResponse.id).toBeDefined();
        expect(groupAchievementResponse.title).toEqual('제목');
        expect(groupAchievementResponse.content).toEqual('내용');
        expect(groupAchievementResponse.category.id).toEqual(groupCategory.id);
        expect(groupAchievementResponse.category.achieveCount).toEqual(1);
        expect(groupAchievementResponse.category.name).toEqual('category');
        expect(groupAchievementResponse.userCode).toEqual(user.userCode);
        expect(groupAchievementResponse.imageUrl).toEqual(image.imageUrl);
        expect(groupAchievementResponse.createdAt).toBeDefined();
      });
    });

    it('그룹에 속한 관리자는 그룹내 달성기록을 생성할 때 카테고리를 미설정하고 달성기록을 생성할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroup('GROUP', leader);

        const user = await usersFixture.getUser('DEF');
        await groupFixture.addMember(group, user, UserGroupGrade.MANAGER);
        const image = await imageFixture.getImage(user, 'image');

        const groupAchievementCreateRequest = new GroupAchievementCreateRequest(
          '제목',
          '내용',
          -1,
          image.id,
        );

        // when
        const groupAchievementResponse = await groupAchievementService.create(
          user,
          group.id,
          groupAchievementCreateRequest,
        );

        // then
        expect(groupAchievementResponse.id).toBeDefined();
        expect(groupAchievementResponse.title).toEqual('제목');
        expect(groupAchievementResponse.content).toEqual('내용');
        expect(groupAchievementResponse.category.id).toEqual(-1);
        expect(groupAchievementResponse.category.achieveCount).toEqual(1);
        expect(groupAchievementResponse.category.name).toEqual('미설정');
        expect(groupAchievementResponse.userCode).toEqual(user.userCode);
        expect(groupAchievementResponse.imageUrl).toEqual(image.imageUrl);
        expect(groupAchievementResponse.createdAt).toBeDefined();
      });
    });
  });

  describe('getAchievementDetail은 그룹내 특정 달성기록을 조회할 수 있다.', () => {
    it('작성자는 그룹내 특정 달성기록을 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroup('GROUP', user);
        const groupCtg = await groupCategoryFixture.createCategory(user, group);
        const groupAchievement =
          await groupAchievementFixture.createGroupAchievement(
            user,
            group,
            groupCtg,
          );

        // when
        const groupAchievementDetail =
          await groupAchievementService.getAchievementDetail(
            user,
            group.id,
            groupAchievement.id,
          );

        // then
        expect(groupAchievementDetail.id).toEqual(groupAchievement.id);
        expect(groupAchievementDetail.title).toEqual(groupAchievement.title);
        expect(groupAchievementDetail.content).toEqual(
          groupAchievement.content,
        );
      });
    });

    it('작성자와 같은 그룹 유저는 달성기록을 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const writer = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroup('GROUP', writer);
        const groupCtg = await groupCategoryFixture.createCategory(
          writer,
          group,
        );
        const groupAchievement =
          await groupAchievementFixture.createGroupAchievement(
            writer,
            group,
            groupCtg,
          );

        const reader = await usersFixture.getUser('DEF');
        await groupFixture.addMember(group, reader, UserGroupGrade.PARTICIPANT);

        // when
        const groupAchievementDetail =
          await groupAchievementService.getAchievementDetail(
            reader,
            group.id,
            groupAchievement.id,
          );

        // then
        expect(groupAchievementDetail.id).toEqual(groupAchievement.id);
        expect(groupAchievementDetail.title).toEqual(groupAchievement.title);
        expect(groupAchievementDetail.content).toEqual(
          groupAchievement.content,
        );
      });
    });

    it('작성자와 같은 그룹 유저는 달성기록을 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const writer = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroup('GROUP', writer);
        const groupCtg = await groupCategoryFixture.createCategory(
          writer,
          group,
        );
        const groupAchievement =
          await groupAchievementFixture.createGroupAchievement(
            writer,
            group,
            groupCtg,
          );

        const reader = await usersFixture.getUser('DEF');
        await groupFixture.addMember(group, reader, UserGroupGrade.PARTICIPANT);

        const otherUser = await usersFixture.getUser('GHI');
        const otherGroup = await groupFixture.createGroup('GROUP2', otherUser);

        // when
        // then
        await expect(
          groupAchievementService.getAchievementDetail(
            reader,
            otherGroup.id,
            groupAchievement.id,
          ),
        ).rejects.toThrow(UnauthorizedAchievementException);
      });
    });

    it('작성자와 다른 그룹 유저는 달성기록을 조회할 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const writer = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroup('GROUP', writer);
        const groupCtg = await groupCategoryFixture.createCategory(
          writer,
          group,
        );
        const groupAchievement =
          await groupAchievementFixture.createGroupAchievement(
            writer,
            group,
            groupCtg,
          );

        const reader = await usersFixture.getUser('DEF');

        // when
        // then
        await expect(
          groupAchievementService.getAchievementDetail(
            reader,
            group.id,
            groupAchievement.id,
          ),
        ).rejects.toThrow(UnauthorizedAchievementException);
      });
    });
  });

  test('그룹 달성 기록 리스트에 대한 페이지네이션 조회를 할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('GROUP', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);

      const groupCategory = await groupCategoryFixture.createCategory(
        user1,
        group,
      );
      await groupAchievementFixture.createGroupAchievements(
        5,
        user1,
        group,
        groupCategory,
      );
      await groupAchievementFixture.createGroupAchievements(
        5,
        user2,
        group,
        groupCategory,
      );

      // when
      const firstRequest = new PaginateGroupAchievementRequest(
        groupCategory.id,
        4,
      );
      const firstResponse = await groupAchievementService.getAchievements(
        user1,
        group.id,
        firstRequest,
      );

      const nextRequest = new PaginateAchievementRequest(
        groupCategory.id,
        4,
        firstResponse.next.whereIdLessThan,
      );
      const nextResponse = await groupAchievementService.getAchievements(
        user1,
        group.id,
        nextRequest,
      );

      const lastRequest = new PaginateAchievementRequest(
        groupCategory.id,
        4,
        nextResponse.next.whereIdLessThan,
      );
      const lastResponse = await groupAchievementService.getAchievements(
        user1,
        group.id,
        lastRequest,
      );

      expect(firstResponse.count).toEqual(4);
      expect(firstResponse.data.length).toEqual(4);
      expect(firstResponse.next.whereIdLessThan).toEqual(
        firstResponse.data[3].id,
      );

      expect(nextResponse.count).toEqual(4);
      expect(nextResponse.data.length).toEqual(4);
      expect(nextResponse.next.whereIdLessThan).toEqual(
        nextResponse.data[3].id,
      );

      expect(lastResponse.count).toEqual(2);
      expect(lastResponse.data.length).toEqual(2);
      expect(lastResponse.next).toEqual(null);
    });
  });

  test('차단된 달성 기록은 그룹 달성 기록 리스트에 조회되지 않는다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('GROUP', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);

      const groupCategory = await groupCategoryFixture.createCategory(
        user1,
        group,
      );
      await groupAchievementFixture.createGroupAchievements(
        5,
        user1,
        group,
        groupCategory,
      );
      await groupAchievementFixture.createGroupAchievements(
        5,
        user2,
        group,
        groupCategory,
      );
      const blocked = await groupAchievementFixture.createGroupAchievement(
        user2,
        group,
        groupCategory,
      );
      await groupAchievementService.reject(user1, group.id, blocked.id);

      // when
      const paginateGroupAchievementResponse =
        await groupAchievementService.getAchievements(
          user1,
          group.id,
          new PaginateGroupAchievementRequest(groupCategory.id, 30),
        );

      expect(paginateGroupAchievementResponse.count).toEqual(10);
      expect(paginateGroupAchievementResponse.data.length).toEqual(10);
      expect(paginateGroupAchievementResponse.next).toEqual(null);
    });
  });

  test('나로부터 차단된 그룹원의 달성 기록은 그룹 달성 기록 리스트에 조회되지 않는다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user1 = await usersFixture.getUser('ABC');
      const user2 = await usersFixture.getUser('DEF');
      const group = await groupFixture.createGroup('GROUP', user1);
      await groupFixture.addMember(group, user2, UserGroupGrade.PARTICIPANT);

      const groupCategory = await groupCategoryFixture.createCategory(
        user1,
        group,
      );
      await groupAchievementFixture.createGroupAchievements(
        10,
        user1,
        group,
        groupCategory,
      );
      await groupAchievementFixture.createGroupAchievements(
        10,
        user2,
        group,
        groupCategory,
      );
      await userService.reject(user1, user2.userCode);

      // when
      const paginateGroupAchievementResponse =
        await groupAchievementService.getAchievements(
          user1,
          group.id,
          new PaginateGroupAchievementRequest(groupCategory.id, 30),
        );

      expect(paginateGroupAchievementResponse.count).toEqual(10);
      expect(paginateGroupAchievementResponse.data.length).toEqual(10);
      expect(paginateGroupAchievementResponse.next).toEqual(null);
    });
  });
});
