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
import { GroupCategoryTestModule } from '../../../../test/group/category/group-category-test.module';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { GroupAchievementTestModule } from '../../../../test/group/achievement/group-achievement-test.module';
import { ImageFixture } from '../../../../test/image/image-fixture';
import { ImageTestModule } from '../../../../test/image/image-test.module';

describe('GroupCategoryRepository test', () => {
  let groupCategoryRepository: GroupCategoryRepository;
  let userFixture: UsersFixture;
  let groupFixture: GroupFixture;
  let groupCategoryFixture: GroupCategoryFixture;
  let groupAchievementFixture: GroupAchievementFixture;
  let imageFixture: ImageFixture;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([GroupCategoryRepository]),
        GroupCategoryTestModule,
        GroupAchievementTestModule,
        ImageTestModule,
        GroupTestModule,
        UsersTestModule,
        GroupCategoryModule,
      ],
    }).compile();

    imageFixture = module.get<ImageFixture>(ImageFixture);
    groupAchievementFixture = module.get<GroupAchievementFixture>(
      GroupAchievementFixture,
    );
    groupCategoryFixture =
      module.get<GroupCategoryFixture>(GroupCategoryFixture);
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
        const group = await groupFixture.createGroups(user);
        const groupCategory = new GroupCategory(user, group, '카테고리1');

        // when
        const saved =
          await groupCategoryRepository.saveGroupCategory(groupCategory);

        // then
        expect(saved).toBeInstanceOf(GroupCategory);
        expect(saved.name).toEqual('카테고리1');
        expect(saved.group.id).toEqual(group.id);
        expect(saved.group.name).toEqual(group.name);
        expect(saved.group.avatarUrl).toEqual(group.avatarUrl);
        expect(saved.group.userGroups.length).toEqual(group.userGroups.length);
      });
    });
  });

  describe('findByGroupAndUserWithCount는 그룹의 카테고리를 찾을 수 있다.', () => {
    it('그룹에 생성된 카테고리가 없을 때 그룹 카테고리를 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await userFixture.getUser('ABC');
        const group = await groupFixture.createGroups(leader);

        // when
        const categories =
          await groupCategoryRepository.findGroupCategoriesByUser(
            leader,
            group,
          );

        // then
        expect(categories.length).toEqual(0);
      });
    });

    it('user가 요청한 그룹에 속하면 카테고리 리스트를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await userFixture.getUser('ABC');
        const group = await groupFixture.createGroups(leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '그룹-카테고리~',
        );

        // when
        const categories =
          await groupCategoryRepository.findGroupCategoriesByUser(
            leader,
            group,
          );

        // then
        expect(categories.length).toEqual(2);
        expect(categories[0].categoryName).toEqual('미설정');
        expect(categories[0].categoryId).toEqual(-1);
        expect(categories[0].achievementCount).toEqual(0);
        expect(categories[1].categoryName).toEqual('그룹-카테고리~');
        expect(categories[1].categoryId).toEqual(groupCategory.id);
        expect(categories[1].achievementCount).toEqual(0);
      });
    });

    it('user가 요청한 그룹에 속하면 카테고리 리스트를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await userFixture.getUser('ABC');
        const group = await groupFixture.createGroups(leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '그룹-카테고리~',
        );
        const image = await imageFixture.getImage(leader);
        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
          '업적1',
          image,
        );

        // when
        const categories =
          await groupCategoryRepository.findGroupCategoriesByUser(
            leader,
            group,
          );

        // then
        expect(categories.length).toEqual(2);
        expect(categories[0].categoryName).toEqual('미설정');
        expect(categories[0].categoryId).toEqual(-1);
        expect(categories[0].achievementCount).toEqual(0);
        expect(categories[1].categoryName).toEqual('그룹-카테고리~');
        expect(categories[1].achievementCount).toEqual(1);
      });
    });

    it('user가 요청한 그룹에 속하지 않는다면 카테고리 빈 리스트를 반환한다..', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await userFixture.getUser('ABC');
        const group = await groupFixture.createGroups(leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
          '그룹-카테고리~',
        );
        const image = await imageFixture.getImage(leader);
        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
          '업적1',
          image,
        );

        const user = await userFixture.getUser('DEF');

        // when
        const categories =
          await groupCategoryRepository.findGroupCategoriesByUser(user, group);

        // then
        expect(categories.length).toEqual(0);
      });
    });
  });

  it('findNotSpecifiedByUserAndId는 사용자의 미분류 카테고리를 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await userFixture.getUser('ABC');
      const group = await groupFixture.createGroups(user);
      await groupCategoryFixture.createCategory(user, group, '미분류');
      await groupAchievementFixture.createGroupAchievements(
        4,
        user,
        group,
        null,
      );

      // when
      const retrievedCategory =
        await groupCategoryRepository.findNotSpecifiedByUserAndId(user, group);

      // then
      expect(retrievedCategory.categoryId).toEqual(-1);
      expect(retrievedCategory.categoryName).toEqual('미설정');
      expect(retrievedCategory.achievementCount).toEqual(4);
    });
  });

  describe('findGroupCategoryByIdAndUser는 그룹 카테고리를 조회할 수 있다.', () => {
    it('그룹과 카테고리 아이디를 이용해 알맞은 카테고리를 조회할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await userFixture.getUser('ABC');
        const group = await groupFixture.createGroups(user);
        const groupCategory = await groupCategoryFixture.createCategory(
          user,
          group,
          '카테고리',
        );
        await groupAchievementFixture.createGroupAchievements(
          4,
          user,
          group,
          null,
        );

        // when
        const retrievedCategory =
          await groupCategoryRepository.findByIdAndGroupUser(
            group.id,
            groupCategory.id,
          );

        // then
        expect(retrievedCategory.id).toEqual(groupCategory.id);
        expect(retrievedCategory.name).toEqual(groupCategory.name);
      });
    });

    it('그룹과 카테고리 아이디가 일치하지 않으면 카테고리를 조회할 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await userFixture.getUser('ABC');
        const group = await groupFixture.createGroups(user);
        const groupCategory = await groupCategoryFixture.createCategory(
          user,
          group,
          '카테고리',
        );
        await groupAchievementFixture.createGroupAchievements(
          4,
          user,
          group,
          null,
        );

        const otherGroup = await groupFixture.createGroups(user);

        // when
        const retrievedCategory =
          await groupCategoryRepository.findByIdAndGroupUser(
            otherGroup.id,
            groupCategory.id,
          );

        // then
        expect(retrievedCategory).toBeUndefined();
      });
    });
  });
});
