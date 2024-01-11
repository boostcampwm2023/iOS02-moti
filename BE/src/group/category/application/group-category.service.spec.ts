import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../../config/typeorm';
import { UsersTestModule } from '../../../../test/user/users-test.module';
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
import { GroupCategoryTestModule } from '../../../../test/group/category/group-category-test.module';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';
import { GroupAchievementTestModule } from '../../../../test/group/achievement/group-achievement-test.module';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { UnauthorizedApproachGroupCategoryException } from '../exception/unauthorized-approach-group-category.exception';
import { CategoryRelocateRequest } from '../../../category/dto/category-relocate.request';
import { InvalidCategoryRelocateException } from '../../../category/exception/Invalid-Category-Relocate.exception';
import { GroupCategoryMetadata } from '../dto/group-category-metadata';

describe('GroupCategoryService test', () => {
  let groupCategoryService: GroupCategoryService;
  let dataSource: DataSource;
  let usersFixture: UsersFixture;
  let groupCategoryFixture: GroupCategoryFixture;
  let groupAchievementFixture: GroupAchievementFixture;
  let groupFixture: GroupFixture;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        UsersTestModule,
        ConfigModule.forRoot(configServiceModuleOptions),
        GroupTestModule,
        GroupCategoryModule,
        GroupCategoryTestModule,
        GroupAchievementTestModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    groupAchievementFixture = app.get<GroupAchievementFixture>(
      GroupAchievementFixture,
    );
    groupCategoryFixture = app.get<GroupCategoryFixture>(GroupCategoryFixture);
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
        const group = await groupFixture.createGroups(leader);

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

        const group = await groupFixture.createGroups(leader, participants);

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

        const group = await groupFixture.createGroups(
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

  describe('retrieveCategoryMetadata는 그룹의 카테고리 메타데이터를 조회할 수 있다.', () => {
    it('그룹장은 그룹의 카테고리 메타데이터를 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroups(leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
          '업적1',
        );
        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          null,
          '업적2',
        );

        // when
        const categories = await groupCategoryService.retrieveCategoryMetadata(
          leader,
          group.id,
        );

        // then
        expect(categories.length).toEqual(2);
        expect(categories[0].categoryName).toEqual('미설정');
        expect(categories[0].categoryId).toEqual(-1);
        expect(categories[0].achievementCount).toEqual(1);
        expect(categories[1].categoryName).toEqual('카테고리1');
        expect(categories[1].categoryId).toEqual(groupCategory.id);
        expect(categories[1].achievementCount).toEqual(1);
      });
    });

    it('그룹 멤버는 그룹의 카테고리 메타데이터를 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(5);

        const group = await groupFixture.createGroups(leader, participants);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
          '업적1',
        );
        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          null,
          '업적2',
        );

        // when
        const categories = await groupCategoryService.retrieveCategoryMetadata(
          participants[0],
          group.id,
        );

        // then
        expect(categories.length).toEqual(2);
        expect(categories[0].categoryName).toEqual('미설정');
        expect(categories[0].categoryId).toEqual(-1);
        expect(categories[0].achievementCount).toEqual(1);
        expect(categories[1].categoryName).toEqual('카테고리1');
        expect(categories[1].categoryId).toEqual(groupCategory.id);
        expect(categories[1].achievementCount).toEqual(1);
      });
    });

    it('그룹 관리자는 그룹의 카테고리 메타데이터를 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(5);
        const managers = await usersFixture.getUsers(5);

        const group = await groupFixture.createGroups(
          leader,
          participants,
          managers,
        );
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
          '업적1',
        );
        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          null,
          '업적2',
        );

        // when
        const categories = await groupCategoryService.retrieveCategoryMetadata(
          managers[4],
          group.id,
        );

        // then
        expect(categories.length).toEqual(2);
        expect(categories[0].categoryName).toEqual('미설정');
        expect(categories[0].categoryId).toEqual(-1);
        expect(categories[0].achievementCount).toEqual(1);
        expect(categories[1].categoryName).toEqual('카테고리1');
        expect(categories[1].categoryId).toEqual(groupCategory.id);
        expect(categories[1].achievementCount).toEqual(1);
      });
    });

    it('그룹 멤버는 그룹의 카테고리 메타데이터를 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(5);

        const group = await groupFixture.createGroups(leader, participants);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
          '업적1',
        );
        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          null,
          '업적2',
        );

        // when
        const categories = await groupCategoryService.retrieveCategoryMetadata(
          participants[0],
          group.id,
        );

        // then
        expect(categories.length).toEqual(2);
        expect(categories[0].categoryName).toEqual('미설정');
        expect(categories[0].categoryId).toEqual(-1);
        expect(categories[0].achievementCount).toEqual(1);
        expect(categories[1].categoryName).toEqual('카테고리1');
        expect(categories[1].categoryId).toEqual(groupCategory.id);
        expect(categories[1].achievementCount).toEqual(1);
      });
    });

    it('그룹에 속하지 않은 사용자가 그룹의 카테고리 메타데이터를 조회할 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(5);

        const group = await groupFixture.createGroups(leader, participants);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
          '업적1',
        );
        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          null,
          '업적2',
        );

        const other = await usersFixture.getUser('DEF');

        // when
        // then
        await expect(
          groupCategoryService.retrieveCategoryMetadata(other, group.id),
        ).rejects.toThrow(UnauthorizedApproachGroupCategoryException);
      });
    });

    it('그룹에 속하지 않은 사용자가 그룹의 카테고리 메타데이터를 조회할 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(5);

        const group = await groupFixture.createGroups(leader, participants);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
          '업적1',
        );
        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          null,
          '업적2',
        );

        const other = await usersFixture.getUser('DEF');
        await groupFixture.createGroups(other);

        // when
        // then
        await expect(
          groupCategoryService.retrieveCategoryMetadata(other, group.id),
        ).rejects.toThrow(UnauthorizedApproachGroupCategoryException);
      });
    });
  });

  describe('retrieveCategoryMetadataById는 그룹의 카테고리 메타데이터를 조회할 수 있다.', () => {
    it('그룹장은 그룹의 카테고리 메타데이터를 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroups(leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
          '업적1',
        );

        // when
        const category =
          await groupCategoryService.retrieveCategoryMetadataById(
            leader,
            group.id,
            groupCategory.id,
          );

        // then
        expect(category.categoryName).toEqual('카테고리1');
        expect(category.categoryId).toEqual(groupCategory.id);
        expect(category.achievementCount).toEqual(1);
      });
    });

    it('그룹장은 그룹의 카테고리에 저장된 도전기록이 없어도 메타데이터를 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroups(leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        // when
        const category =
          await groupCategoryService.retrieveCategoryMetadataById(
            leader,
            group.id,
            groupCategory.id,
          );

        // then
        expect(category.categoryName).toEqual('카테고리1');
        expect(category.categoryId).toEqual(groupCategory.id);
        expect(category.achievementCount).toEqual(0);
      });
    });

    it('그룹 멤버는 그룹의 카테고리 메타데이터를 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(5);

        const group = await groupFixture.createGroups(leader, participants);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
          '업적1',
        );

        // when
        const category =
          await groupCategoryService.retrieveCategoryMetadataById(
            participants[0],
            group.id,
            groupCategory.id,
          );

        // then
        expect(category.categoryName).toEqual('카테고리1');
        expect(category.categoryId).toEqual(groupCategory.id);
        expect(category.achievementCount).toEqual(1);
      });
    });

    it('그룹 관리자는 그룹의 카테고리 메타데이터를 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(5);
        const managers = await usersFixture.getUsers(5);

        const group = await groupFixture.createGroups(
          leader,
          participants,
          managers,
        );
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
          '업적1',
        );

        // when
        const category =
          await groupCategoryService.retrieveCategoryMetadataById(
            managers[4],
            group.id,
            groupCategory.id,
          );

        // then
        expect(category.categoryName).toEqual('카테고리1');
        expect(category.categoryId).toEqual(groupCategory.id);
        expect(category.achievementCount).toEqual(1);
      });
    });

    it('그룹 멤버는 그룹의 카테고리 메타데이터를 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(5);

        const group = await groupFixture.createGroups(leader, participants);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
          '업적1',
        );

        // when
        const category =
          await groupCategoryService.retrieveCategoryMetadataById(
            participants[0],
            group.id,
            groupCategory.id,
          );

        // then
        expect(category.categoryName).toEqual('카테고리1');
        expect(category.categoryId).toEqual(groupCategory.id);
        expect(category.achievementCount).toEqual(1);
      });
    });

    it('그룹에 속하지 않은 사용자가 그룹의 카테고리 메타데이터를 조회할 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(5);

        const group = await groupFixture.createGroups(leader, participants);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        const other = await usersFixture.getUser('DEF');

        // when
        // then
        await expect(
          groupCategoryService.retrieveCategoryMetadataById(
            other,
            group.id,
            groupCategory.id,
          ),
        ).rejects.toThrow(UnauthorizedApproachGroupCategoryException);
      });
    });

    it('그룹에 속하지 않은 사용자가 그룹의 카테고리 메타데이터를 조회할 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');
        const participants = await usersFixture.getUsers(5);

        const group = await groupFixture.createGroups(leader, participants);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        const other = await usersFixture.getUser('DEF');
        await groupFixture.createGroups(other);

        // when
        // then
        await expect(
          groupCategoryService.retrieveCategoryMetadataById(
            other,
            group.id,
            groupCategory.id,
          ),
        ).rejects.toThrow(UnauthorizedApproachGroupCategoryException);
      });
    });

    it('요청한 그룹에 속한 카테고리가 아닐 때 UnauthorizedApproachGroupCategoryException를 발생시킨다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');

        const group = await groupFixture.createGroups(leader);

        await groupCategoryFixture.createCategory(leader, group, '카테고리1');
        await groupCategoryFixture.createCategory(leader, group, '카테고리2');
        await groupCategoryFixture.createCategory(leader, group, '카테고리3');

        const otherUser = await usersFixture.getUser('DEF');
        const otherGroup = await groupFixture.createGroups(otherUser);

        await groupCategoryFixture.createCategory(
          otherUser,
          otherGroup,
          '카테고리4',
        );
        // when
        // then

        await expect(
          groupCategoryService.retrieveCategoryMetadataById(
            leader,
            group.id,
            otherGroup.id,
          ),
        ).rejects.toThrow(UnauthorizedApproachGroupCategoryException);
      });
    });

    it('요청자가 해당 그룹에 속해있다면 전체 카테고리를 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');

        const group = await groupFixture.createGroups(leader);

        const groupCategory1 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );
        const groupCategory2 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리2',
        );
        await groupCategoryFixture.createCategory(leader, group, '카테고리3');

        await groupAchievementFixture.createGroupAchievements(
          10,
          leader,
          group,
          groupCategory1,
        );

        await groupAchievementFixture.createGroupAchievements(
          20,
          leader,
          group,
          groupCategory2,
        );

        await groupAchievementFixture.createGroupAchievements(
          15,
          leader,
          group,
          null,
        );

        // when
        const category =
          await groupCategoryService.retrieveCategoryMetadataById(
            leader,
            group.id,
            0,
          );

        // then
        expect(category.categoryName).toEqual('전체');
        expect(category.categoryId).toEqual(0);
        expect(category.achievementCount).toEqual(45);
        expect(category.insertedAt).toBeDefined();
      });
    });
  });

  describe('relocateCategory는 카테고리 순서를 재배열할 수 있다.', () => {
    it('카테고리 순서를 변경한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');

        const group = await groupFixture.createGroups(leader);

        const groupCategory1 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );
        const groupCategory2 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리2',
        );
        const groupCategory3 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리3',
        );
        const groupCategory4 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리4',
        );

        const categoryRelocateRequest = new CategoryRelocateRequest();
        categoryRelocateRequest.order = [
          groupCategory4.id,
          groupCategory3.id,
          groupCategory1.id,
          groupCategory2.id,
        ];

        // when
        await groupCategoryService.relocateCategory(
          leader,
          group.id,
          categoryRelocateRequest,
        );
        const categories = await groupCategoryService.retrieveCategoryMetadata(
          leader,
          group.id,
        );

        // then
        expect(categories.length).toBe(5);
        expect(categories[0].categoryId).toBe(-1);
        expect(categories[1].categoryId).toBe(groupCategory4.id);
        expect(categories[2].categoryId).toBe(groupCategory3.id);
        expect(categories[3].categoryId).toBe(groupCategory1.id);
        expect(categories[4].categoryId).toBe(groupCategory2.id);
      });
    });

    it('모든 카테고리를 요청하지 않으면 에러를 던진다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');

        const group = await groupFixture.createGroups(leader);

        const groupCategory1 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );
        const groupCategory2 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리2',
        );
        const groupCategory3 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리3',
        );
        const groupCategory4 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리4',
        );

        const categoryRelocateRequest = new CategoryRelocateRequest();
        categoryRelocateRequest.order = [groupCategory4.id, groupCategory3.id];

        // when
        // then
        await expect(
          groupCategoryService.relocateCategory(
            leader,
            group.id,
            categoryRelocateRequest,
          ),
        ).rejects.toThrow(InvalidCategoryRelocateException);
      });
    });
  });

  describe('deleteCategory는 카테고리를 삭제할 수 있다.', () => {
    it('그룹의 카테고리를 삭제할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');

        const group = await groupFixture.createGroups(leader);
        const category = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );

        // when
        await groupCategoryService.deleteCategory(
          leader,
          group.id,
          category.id,
        );
        const categoryMetaData: GroupCategoryMetadata[] =
          await groupCategoryService.retrieveCategoryMetadata(leader, group.id);
        // then

        expect(categoryMetaData.length).toBe(0);
      });
    });

    it('카테고리를 삭제해도 기존 순서가 유지된다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('ABC');

        const group = await groupFixture.createGroups(leader);
        const category1 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리1',
        );
        const category2 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리2',
        );
        const category3 = await groupCategoryFixture.createCategory(
          leader,
          group,
          '카테고리3',
        );

        // when
        await groupCategoryService.deleteCategory(
          leader,
          group.id,
          category2.id,
        );
        const categoryMetaData: GroupCategoryMetadata[] =
          await groupCategoryService.retrieveCategoryMetadata(leader, group.id);

        // then
        expect(categoryMetaData.length).toBe(3);
        expect(categoryMetaData[0].categoryId).toBe(-1);
        expect(categoryMetaData[1].categoryId).toBe(category1.id);
        expect(categoryMetaData[2].categoryId).toBe(category3.id);
      });
    });
  });
});
