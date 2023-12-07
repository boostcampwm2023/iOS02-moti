import { GroupAchievementEmojiRepository } from './group-achievement-emoji.repository';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../../config/typeorm';
import { UsersTestModule } from '../../../../test/user/users-test.module';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../../config/config';
import { UsersFixture } from '../../../../test/user/users-fixture';
import { GroupTestModule } from '../../../../test/group/group/group-test.module';
import { CustomTypeOrmModule } from '../../../config/typeorm/custom-typeorm.module';
import { GroupRepository } from '../../group/entities/group.repository';
import { UserGroupRepository } from '../../group/entities/user-group.repository';
import { GroupAchievementRepository } from '../../achievement/entities/group-achievement.repository';
import { GroupCategoryTestModule } from '../../../../test/group/category/group-category-test.module';
import { ImageTestModule } from '../../../../test/image/image-test.module';
import { GroupAchievementTestModule } from '../../../../test/group/achievement/group-achievement-test.module';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';
import { GroupAchievementEmojiModule } from '../group-achievement-emoji.module';
import { transactionTest } from '../../../../test/common/transaction-test';
import { GroupAchievementEmoji } from '../domain/group-achievement-emoji.domain';
import { Emoji } from '../domain/emoji';
import { GroupAchievementEmojiFixture } from '../../../../test/group/emoji/group-achievement-emoji-fixture';
import { GroupAchievementEmojiTestModule } from '../../../../test/group/emoji/group-achievement-emoji-test.module';

describe('GroupAchievementEmojiRepository Test', () => {
  let groupAchievementEmojiRepository: GroupAchievementEmojiRepository;
  let groupFixture: GroupFixture;
  let usersFixture: UsersFixture;
  let groupAchievementEmojiFixture: GroupAchievementEmojiFixture;
  let groupAchievementFixture: GroupAchievementFixture;
  let groupCategoryFixture: GroupCategoryFixture;
  let dataSource: DataSource;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(typeOrmModuleOptions),
        ConfigModule.forRoot(configServiceModuleOptions),
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
        GroupAchievementEmojiModule,
        GroupAchievementEmojiTestModule,
      ],
      controllers: [],
      providers: [],
    }).compile();

    groupAchievementEmojiRepository = app.get<GroupAchievementEmojiRepository>(
      GroupAchievementEmojiRepository,
    );
    groupAchievementEmojiFixture = app.get<GroupAchievementEmojiFixture>(
      GroupAchievementEmojiFixture,
    );
    groupCategoryFixture = app.get<GroupCategoryFixture>(GroupCategoryFixture);
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

  describe('테스트 환경 확인', () => {
    it('groupAchievementEmojiRepository가 정의되어 있어야 한다.', () => {
      expect(groupAchievementEmojiRepository).toBeDefined();
    });
  });

  describe('saveGroupAchievementEmoji는 그룹 달성기록에 이모지를 저장시킬 수 있다.', () => {
    it('saveGroupAchievementEmoji를 실행하면 그룹 달성기록에 이모지를 저장시킬 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroups(user);
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

        const groupAchievementEmoji = new GroupAchievementEmoji(
          groupAchievement,
          user,
          Emoji.FIRE,
        );

        // when
        const savedGroupAchievementEmoji =
          await groupAchievementEmojiRepository.saveGroupAchievementEmoji(
            groupAchievementEmoji,
          );

        const groupAchievementEmojiEntity =
          await groupAchievementEmojiRepository.repository.findOne({
            where: {
              id: savedGroupAchievementEmoji.id,
            },
            relations: ['groupAchievement', 'user'],
          });

        // then
        expect(groupAchievementEmojiEntity).toBeDefined();
        expect(groupAchievementEmojiEntity?.id).toEqual(
          savedGroupAchievementEmoji.id,
        );
        expect(groupAchievementEmojiEntity?.groupAchievement.id).toEqual(
          savedGroupAchievementEmoji.groupAchievement.id,
        );
        expect(groupAchievementEmojiEntity?.user.id).toEqual(
          savedGroupAchievementEmoji.user.id,
        );
        expect(groupAchievementEmojiEntity?.emoji).toEqual(
          savedGroupAchievementEmoji.emoji,
        );
      });
    });
  });

  describe('getGroupAchievementEmojiById는 사용자가 이모지를 넣었는지 탐색할 수 있다.', () => {
    it('getGroupAchievementEmojiById를 실행하면 사용자가 이모지를 넣었는지 탐색할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroups(user);
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

        const groupAchievementEmoji =
          await groupAchievementEmojiFixture.createGroupAchievementEmoji(
            user,
            groupAchievement,
            Emoji.FIRE,
          );

        // when
        const savedGroupAchievementEmoji =
          await groupAchievementEmojiRepository.getGroupAchievementEmojiByGroupAchievementIdAndUserAndEmoji(
            groupAchievement.id,
            user,
            Emoji.FIRE,
          );

        // then
        expect(savedGroupAchievementEmoji).toBeDefined();
        expect(savedGroupAchievementEmoji.id).toEqual(groupAchievementEmoji.id);
        expect(savedGroupAchievementEmoji.groupAchievement).toBeUndefined();
        expect(savedGroupAchievementEmoji.user).toBeUndefined();
        expect(savedGroupAchievementEmoji.emoji).toEqual(Emoji.FIRE);
      });
    });

    it('getGroupAchievementEmojiById를 실행하면 사용자가 이모지를 넣지 않았다면 undefined를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroups(user);
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

        await groupAchievementEmojiFixture.createGroupAchievementEmoji(
          user,
          groupAchievement,
          Emoji.LIKE,
        );

        // when
        const savedGroupAchievementEmoji =
          await groupAchievementEmojiRepository.getGroupAchievementEmojiByGroupAchievementIdAndUserAndEmoji(
            groupAchievement.id,
            user,
            Emoji.FIRE,
          );

        // then
        expect(savedGroupAchievementEmoji).toBeUndefined();
      });
    });

    it('getGroupAchievementEmojiById를 실행하면 사용자가 이모지를 넣지 않았다면 undefined를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroups(user);
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
        const savedGroupAchievementEmoji =
          await groupAchievementEmojiRepository.getGroupAchievementEmojiByGroupAchievementIdAndUserAndEmoji(
            groupAchievement.id,
            user,
            Emoji.FIRE,
          );

        // then
        expect(savedGroupAchievementEmoji).toBeUndefined();
      });
    });

    it('getGroupAchievementEmojiById를 실행하면 사용자가 이모지를 넣지 않았다면 undefined를 반환한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroups(user);
        await groupCategoryFixture.createCategory(user, group);

        // when
        const savedGroupAchievementEmoji =
          await groupAchievementEmojiRepository.getGroupAchievementEmojiByGroupAchievementIdAndUserAndEmoji(
            0,
            user,
            Emoji.FIRE,
          );

        // then
        expect(savedGroupAchievementEmoji).toBeUndefined();
      });
    });
  });

  describe('deleteGroupAchievementEmoji는 그룹 달성기록에 이모지를 삭제시킬 수 있다.', () => {
    it('deleteGroupAchievementEmoji를 실행하면 그룹 달성기록에 이모지를 삭제시킬 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('ABC');
        const group = await groupFixture.createGroups(user);
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

        const groupAchievementEmoji =
          await groupAchievementEmojiFixture.createGroupAchievementEmoji(
            user,
            groupAchievement,
            Emoji.FIRE,
          );

        // when
        await groupAchievementEmojiRepository.deleteGroupAchievementEmoji(
          groupAchievementEmoji,
        );

        const groupAchievementEmojiEntity =
          await groupAchievementEmojiRepository.repository.findOne({
            where: {
              id: groupAchievementEmoji.id,
            },
          });

        // then
        expect(groupAchievementEmojiEntity).toBeFalsy();
      });
    });
  });
});
