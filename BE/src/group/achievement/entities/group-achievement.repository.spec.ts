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
import { CustomTypeOrmModule } from '../../../config/typeorm/custom-typeorm.module';
import { GroupTestModule } from '../../../../test/group/group/group-test.module';
import { GroupAchievementRepository } from './group-achievement.repository';
import { GroupRepository } from '../../group/entities/group.repository';
import { UserGroupRepository } from '../../group/entities/user-group.repository';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { GroupAchievementTestModule } from '../../../../test/group/achievement/group-achievement-test.module';
import { GroupAchievement } from '../domain/group-achievement.domain';
import { ImageTestModule } from '../../../../test/image/image-test.module';
import { ImageFixture } from '../../../../test/image/image-fixture';
import { GroupCategoryTestModule } from '../../../../test/group/category/group-category-test.module';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';
import { dateFormat } from '../../../common/utils/date-formatter';

describe('GroupRepository Test', () => {
  let groupAchievementRepository: GroupAchievementRepository;
  let groupFixture: GroupFixture;
  let usersFixture: UsersFixture;
  let imageFixture: ImageFixture;
  let groupAchievementFixture: GroupAchievementFixture;
  let groupCategoryFixture: GroupCategoryFixture;
  let dataSource: DataSource;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configServiceModuleOptions),
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        CustomTypeOrmModule.forCustomRepository([
          GroupRepository,
          UserGroupRepository,
          GroupAchievementRepository,
        ]),
        GroupCategoryTestModule,
        ImageTestModule,
        UsersTestModule,
        GroupTestModule,
        GroupAchievementTestModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    groupAchievementRepository = app.get<GroupAchievementRepository>(
      GroupAchievementRepository,
    );
    groupCategoryFixture = app.get<GroupCategoryFixture>(GroupCategoryFixture);
    imageFixture = app.get<ImageFixture>(ImageFixture);
    usersFixture = app.get<UsersFixture>(UsersFixture);
    groupFixture = app.get<GroupFixture>(GroupFixture);
    groupAchievementFixture = app.get<GroupAchievementFixture>(
      GroupAchievementFixture,
    );
    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  test('그룹 달성 기록을 저장할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const group = await groupFixture.createGroup('GROUP', user);
      const image = await imageFixture.getImage(user);
      const groupCategory = await groupCategoryFixture.createCategory(
        user,
        group,
      );
      const groupAchievement = new GroupAchievement(
        'title',
        user,
        group,
        groupCategory,
        `content`,
        image,
      );

      // when
      const saved =
        await groupAchievementRepository.saveGroupAchievement(groupAchievement);

      const fullSaved = await groupAchievementRepository.repository.findOne({
        where: {
          id: saved.id,
        },
        relations: [
          'user',
          'group',
          'image',
          'image.groupAchievement',
          'groupCategory',
        ],
      });

      // then
      expect(fullSaved.id).toEqual(user.id);
      expect(fullSaved.group.id).toEqual(group.id);
      expect(fullSaved.title).toEqual('title');
      expect(fullSaved.content).toEqual('content');
      expect(fullSaved.image.id).toEqual(image.id);
      expect(fullSaved.image.groupAchievement.id).toBe(saved.id);
      expect(fullSaved.user.id).toEqual(user.id);
      expect(fullSaved.groupCategory.id).toEqual(groupCategory.id);
    });
  });

  test('카테고리 미설정으로 그룹 달성 기록을 저장할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const group = await groupFixture.createGroup('GROUP', user);
      const image = await imageFixture.getImage(user);
      const groupAchievement = new GroupAchievement(
        'title',
        user,
        group,
        null,
        `content`,
        image,
      );

      // when
      const saved =
        await groupAchievementRepository.saveGroupAchievement(groupAchievement);

      const fullSaved = await groupAchievementRepository.repository.findOne({
        where: {
          id: saved.id,
        },
        relations: ['user', 'group', 'image', 'image.groupAchievement'],
      });

      // then
      expect(fullSaved.id).toEqual(user.id);
      expect(fullSaved.group.id).toEqual(group.id);
      expect(fullSaved.title).toEqual('title');
      expect(fullSaved.content).toEqual('content');
      expect(fullSaved.image.id).toEqual(image.id);
      expect(fullSaved.image.groupAchievement.id).toBe(saved.id);
      expect(fullSaved.user.id).toEqual(user.id);
    });
  });

  test('그룹 달성 기록을 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const group = await groupFixture.createGroup('GROUP', user);
      const groupCategory = await groupCategoryFixture.createCategory(
        user,
        group,
      );
      const groupAchievement =
        await groupAchievementFixture.createGroupAchievement(
          user,
          group,
          groupCategory,
        );

      // when
      const findGroupAchievement =
        await groupAchievementRepository.findAchievementDetail(
          user.id,
          groupAchievement.id,
        );

      // then
      expect(findGroupAchievement.id).toEqual(groupAchievement.id);
      expect(findGroupAchievement.title).toEqual(groupAchievement.title);
      expect(findGroupAchievement.content).toEqual(groupAchievement.content);
      expect(findGroupAchievement.imageUrl).toEqual(
        groupAchievement.image.imageUrl,
      );
      expect(findGroupAchievement.createdAt).toEqual(
        dateFormat(groupAchievement.createdAt),
      );
      expect(findGroupAchievement.category.achieveCount).toEqual(1);
      expect(findGroupAchievement.category.name).toEqual(groupCategory.name);
      expect(findGroupAchievement.category.id).toEqual(groupCategory.id);
    });
  });

  test('그룹 달성 기록을 조회할 수 없을 때 null을 반환한다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');

      // when
      const findGroupAchievement =
        await groupAchievementRepository.findAchievementDetail(user.id, 2);

      // then
      expect(findGroupAchievement).toBeNull();
    });
  });

  test('그룹 달성 기록을 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const group = await groupFixture.createGroup('GROUP', user);
      const groupCategory = await groupCategoryFixture.createCategory(
        user,
        group,
      );
      const groupAchievements =
        await groupAchievementFixture.createGroupAchievements(
          10,
          user,
          group,
          groupCategory,
        );

      // when
      const findGroupAchievement =
        await groupAchievementRepository.findAchievementDetail(
          user.id,
          groupAchievements[9].id,
        );

      // then
      expect(findGroupAchievement.category.achieveCount).toEqual(10);
    });
  });

  test('그룹 달성 기록 id로 조회할 수 있다.', async () => {
    await transactionTest(dataSource, async () => {
      // given
      const user = await usersFixture.getUser('ABC');
      const group = await groupFixture.createGroup('GROUP', user);
      const groupAchievement =
        await groupAchievementFixture.createGroupAchievement(user, group, null);

      // when
      const findById = await groupAchievementRepository.findById(
        groupAchievement.id,
      );

      // then
      expect(findById.user.id).toEqual(user.id);
      expect(findById.user.userCode).toEqual(user.userCode);
      expect(findById.group.id).toEqual(group.id);
      expect(findById.id).toEqual(groupAchievement.id);
      expect(findById.title).toEqual(groupAchievement.title);
      expect(findById.content).toEqual(groupAchievement.content);
      expect(findById.createdAt).toEqual(groupAchievement.createdAt);
    });
  });
});
