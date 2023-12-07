import { UsersFixture } from '../../../../test/user/users-fixture';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { configServiceModuleOptions } from '../../../config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from '../../../config/typeorm';
import { GroupAchievementModule } from '../../achievement/group-achievement.module';
import { UsersModule } from '../../../users/users.module';
import { GroupCategoryTestModule } from '../../../../test/group/category/group-category-test.module';
import { ImageTestModule } from '../../../../test/image/image-test.module';
import { UsersTestModule } from '../../../../test/user/users-test.module';
import { GroupTestModule } from '../../../../test/group/group/group-test.module';
import { GroupAchievementTestModule } from '../../../../test/group/achievement/group-achievement-test.module';
import { GroupAchievementEmojiTestModule } from '../../../../test/group/emoji/group-achievement-emoji-test.module';
import { GroupAchievementEmojiService } from './group-achievement-emoji.service';
import { GroupAchievementEmojiModule } from '../group-achievement-emoji.module';
import { transactionTest } from '../../../../test/common/transaction-test';
import { Emoji } from '../domain/emoji';
import { GroupAchievementEmojiRepository } from '../entities/group-achievement-emoji.repository';
import { GroupAchievementEmojiResponse } from '../dto/group-achievement-emoji-response';
import { GroupAchievementEmojiFixture } from '../../../../test/group/emoji/group-achievement-emoji-fixture';
import { UserGroupGrade } from '../../group/domain/user-group-grade';
import { NoSuchGroupUserException } from '../../achievement/exception/no-such-group-user.exception';
import { UnauthorizedAchievementException } from '../../../achievement/exception/unauthorized-achievement.exception';

describe('GroupAchievementEmojiService Test', () => {
  let groupAchievementEmojiService: GroupAchievementEmojiService;
  let groupAchievementEmojiRepository: GroupAchievementEmojiRepository;
  let usersFixture: UsersFixture;
  let groupFixture: GroupFixture;
  let groupAchievementFixture: GroupAchievementFixture;
  let groupCategoryFixture: GroupCategoryFixture;
  let groupAchievementEmojiFixture: GroupAchievementEmojiFixture;
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
        GroupAchievementEmojiTestModule,
        GroupAchievementEmojiModule,
      ],
      providers: [],
    }).compile();

    groupAchievementEmojiFixture = module.get<GroupAchievementEmojiFixture>(
      GroupAchievementEmojiFixture,
    );
    groupAchievementEmojiRepository =
      module.get<GroupAchievementEmojiRepository>(
        GroupAchievementEmojiRepository,
      );
    groupAchievementEmojiService = module.get<GroupAchievementEmojiService>(
      GroupAchievementEmojiService,
    );
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

  describe('테스트 환경 확인', () => {
    it('groupAchievementEmojiService가 정의되어 있다.', () => {
      expect(groupAchievementEmojiService).toBeDefined();
    });
  });

  describe('saveGroupAchievementEmoji는 그룹 달성기록에 이모지를 저장시킬 수 있다.', () => {
    it('그룹 달성기록에 이모지를 저장시킬 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('user');
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
        const groupAchievementEmojiResponse =
          await groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            groupAchievement.id,
            Emoji.LIKE,
          );

        const groupAchievementEmojiEntity =
          await groupAchievementEmojiRepository.repository.findOne({
            where: {
              groupAchievement: {
                id: groupAchievement.id,
              },
              user: {
                id: user.id,
              },
              emoji: Emoji.LIKE,
            },
            relations: ['groupAchievement', 'user'],
          });

        // then
        expect(groupAchievementEmojiResponse).toEqual(
          GroupAchievementEmojiResponse.of(Emoji.LIKE, true),
        );
        expect(groupAchievementEmojiEntity).toBeDefined();
        expect(groupAchievementEmojiEntity.groupAchievement.id).toBe(
          groupAchievement.id,
        );
        expect(groupAchievementEmojiEntity.user.id).toBe(user.id);
        expect(groupAchievementEmojiEntity.emoji).toBe(Emoji.LIKE);
      });
    });

    it('그룹 달성기록에 이모지를 저장시킬 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('user');
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
        const groupAchievementEmojiResponse =
          await groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            groupAchievement.id,
            Emoji.FIRE,
          );

        const groupAchievementEmojiEntity =
          await groupAchievementEmojiRepository.repository.findOne({
            where: {
              groupAchievement: {
                id: groupAchievement.id,
              },
              user: {
                id: user.id,
              },
              emoji: Emoji.FIRE,
            },
            relations: ['groupAchievement', 'user'],
          });

        // then
        expect(groupAchievementEmojiResponse).toEqual(
          GroupAchievementEmojiResponse.of(Emoji.FIRE, true),
        );
        expect(groupAchievementEmojiEntity).toBeDefined();
        expect(groupAchievementEmojiEntity.groupAchievement.id).toBe(
          groupAchievement.id,
        );
        expect(groupAchievementEmojiEntity.user.id).toBe(user.id);
        expect(groupAchievementEmojiEntity.emoji).toBe(Emoji.FIRE);
      });
    });

    it('그룹 달성기록에 이모지를 저장시킬 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('user');
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
        const groupAchievementEmojiResponse =
          await groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            groupAchievement.id,
            Emoji.SMILE,
          );

        const groupAchievementEmojiEntity =
          await groupAchievementEmojiRepository.repository.findOne({
            where: {
              groupAchievement: {
                id: groupAchievement.id,
              },
              user: {
                id: user.id,
              },
              emoji: Emoji.SMILE,
            },
            relations: ['groupAchievement', 'user'],
          });

        // then
        expect(groupAchievementEmojiResponse).toEqual(
          GroupAchievementEmojiResponse.of(Emoji.SMILE, true),
        );
        expect(groupAchievementEmojiEntity).toBeDefined();
        expect(groupAchievementEmojiEntity.groupAchievement.id).toBe(
          groupAchievement.id,
        );
        expect(groupAchievementEmojiEntity.user.id).toBe(user.id);
        expect(groupAchievementEmojiEntity.emoji).toBe(Emoji.SMILE);
      });
    });

    it('그룹 달성기록에 이모지를 저장시킬 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('user');
        const group = await groupFixture.createGroups(user);
        const groupAchievement =
          await groupAchievementFixture.createGroupAchievement(
            user,
            group,
            null,
          );

        // when
        const groupAchievementEmojiResponse =
          await groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            groupAchievement.id,
            Emoji.LIKE,
          );

        const groupAchievementEmojiEntity =
          await groupAchievementEmojiRepository.repository.findOne({
            where: {
              groupAchievement: {
                id: groupAchievement.id,
              },
              user: {
                id: user.id,
              },
              emoji: Emoji.LIKE,
            },
            relations: ['groupAchievement', 'user'],
          });

        // then
        expect(groupAchievementEmojiResponse).toEqual(
          GroupAchievementEmojiResponse.of(Emoji.LIKE, true),
        );
        expect(groupAchievementEmojiEntity).toBeDefined();
        expect(groupAchievementEmojiEntity.groupAchievement.id).toBe(
          groupAchievement.id,
        );
        expect(groupAchievementEmojiEntity.user.id).toBe(user.id);
        expect(groupAchievementEmojiEntity.emoji).toBe(Emoji.LIKE);
      });
    });

    it('이미 저장된 이모지를 이미 등록했으면 취소한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('user');
        const group = await groupFixture.createGroups(user);
        const groupAchievement =
          await groupAchievementFixture.createGroupAchievement(
            user,
            group,
            null,
          );
        await groupAchievementEmojiFixture.createGroupAchievementEmoji(
          user,
          groupAchievement,
          Emoji.LIKE,
        );

        // when
        const groupAchievementEmojiResponse =
          await groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            groupAchievement.id,
            Emoji.LIKE,
          );

        const groupAchievementEmojiEntity =
          await groupAchievementEmojiRepository.repository.findOne({
            where: {
              groupAchievement: {
                id: groupAchievement.id,
              },
              user: {
                id: user.id,
              },
              emoji: Emoji.LIKE,
            },
            relations: ['groupAchievement', 'user'],
          });

        // then
        expect(groupAchievementEmojiResponse).toEqual(
          GroupAchievementEmojiResponse.of(Emoji.LIKE, false),
        );
        expect(groupAchievementEmojiEntity).toBeNull();
      });
    });

    it('그룹에 속한 다른 사용자가 그룹 달성 기록에 이모지를 남길 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('user');
        const group = await groupFixture.createGroups(leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
        );
        const groupAchievement =
          await groupAchievementFixture.createGroupAchievement(
            leader,
            group,
            groupCategory,
          );

        const user = await usersFixture.getUser('otherUser');
        await groupFixture.addMember(group, user, UserGroupGrade.MANAGER);

        // when
        const groupAchievementEmojiResponse =
          await groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            groupAchievement.id,
            Emoji.LIKE,
          );

        const groupAchievementEmojiEntity =
          await groupAchievementEmojiRepository.repository.findOne({
            where: {
              groupAchievement: {
                id: groupAchievement.id,
              },
              user: {
                id: user.id,
              },
              emoji: Emoji.LIKE,
            },
            relations: ['groupAchievement', 'user'],
          });

        // then
        expect(groupAchievementEmojiResponse).toEqual(
          GroupAchievementEmojiResponse.of(Emoji.LIKE, true),
        );
        expect(groupAchievementEmojiEntity).toBeDefined();
        expect(groupAchievementEmojiEntity.groupAchievement.id).toBe(
          groupAchievement.id,
        );
        expect(groupAchievementEmojiEntity.user.id).toBe(user.id);
        expect(groupAchievementEmojiEntity.emoji).toBe(Emoji.LIKE);
      });
    });

    it('그룹에 속한 사용자가 이미 저장된 이모지를 이미 등록했으면 취소한다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('user');
        const group = await groupFixture.createGroups(leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
        );
        const groupAchievement =
          await groupAchievementFixture.createGroupAchievement(
            leader,
            group,
            groupCategory,
          );

        const user = await usersFixture.getUser('user');
        await groupFixture.addMember(group, user, UserGroupGrade.MANAGER);

        await groupAchievementEmojiFixture.createGroupAchievementEmoji(
          user,
          groupAchievement,
          Emoji.LIKE,
        );

        // when
        const groupAchievementEmojiResponse =
          await groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            groupAchievement.id,
            Emoji.LIKE,
          );

        const groupAchievementEmojiEntity =
          await groupAchievementEmojiRepository.repository.findOne({
            where: {
              groupAchievement: {
                id: groupAchievement.id,
              },
              user: {
                id: user.id,
              },
              emoji: Emoji.LIKE,
            },
            relations: ['groupAchievement', 'user'],
          });

        // then
        expect(groupAchievementEmojiResponse).toEqual(
          GroupAchievementEmojiResponse.of(Emoji.LIKE, false),
        );
        expect(groupAchievementEmojiEntity).toBeNull();
      });
    });

    it('그룹에 속하지 않은 다른 사용자가 그룹 달성 기록에 이모지를 남길 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('user');
        const group = await groupFixture.createGroups(leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
        );
        const groupAchievement =
          await groupAchievementFixture.createGroupAchievement(
            leader,
            group,
            groupCategory,
          );

        const user = await usersFixture.getUser('otherUser');

        // when
        await expect(
          groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            groupAchievement.id,
            Emoji.LIKE,
          ),
        ).rejects.toThrow(NoSuchGroupUserException);
      });
    });

    it('그룹과 도전기록 아이디가 매칭되지 않으면 이모지를 남길 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('user');
        const group = await groupFixture.createGroups(leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
        );
        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
        );

        const otherUser = await usersFixture.getUser('otherUser');
        const otherGroup = await groupFixture.createGroups(otherUser);
        const otherGroupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
        );
        const otherGroupAchievement =
          await groupAchievementFixture.createGroupAchievement(
            otherUser,
            otherGroup,
            otherGroupCategory,
          );

        const user = await usersFixture.getUser('user');

        // when
        await expect(
          groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            otherGroupAchievement.id,
            Emoji.LIKE,
          ),
        ).rejects.toThrow(UnauthorizedAchievementException);
      });
    });

    it('그룹과 도전기록 아이디가 매칭되지 않으면 이모지를 남길 수 없다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const leader = await usersFixture.getUser('user');
        const group = await groupFixture.createGroups(leader);
        const groupCategory = await groupCategoryFixture.createCategory(
          leader,
          group,
        );

        await groupAchievementFixture.createGroupAchievement(
          leader,
          group,
          groupCategory,
        );

        const otherUser = await usersFixture.getUser('otherUser');
        const otherGroup = await groupFixture.createGroups(otherUser);
        const otherGroupAchievement =
          await groupAchievementFixture.createGroupAchievement(
            otherUser,
            otherGroup,
            null,
          );

        const user = await usersFixture.getUser('user');

        // when
        await expect(
          groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            otherGroupAchievement.id,
            Emoji.LIKE,
          ),
        ).rejects.toThrow(UnauthorizedAchievementException);
      });
    });

    it('그룹 도전기록에 대해 이모지를 토글할 수 있다.', async () => {
      await transactionTest(dataSource, async () => {
        // given
        const user = await usersFixture.getUser('user');
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
        const groupAchievementEmojiFirstOn =
          await groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            groupAchievement.id,
            Emoji.LIKE,
          );

        const groupAchievementEmojiFirstOff =
          await groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            groupAchievement.id,
            Emoji.LIKE,
          );

        const groupAchievementEmojiSecondOn =
          await groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            groupAchievement.id,
            Emoji.LIKE,
          );

        const groupAchievementEmojiSecondOff =
          await groupAchievementEmojiService.toggleAchievementEmoji(
            user,
            group.id,
            groupAchievement.id,
            Emoji.LIKE,
          );

        const groupAchievementEmojiEntity =
          await groupAchievementEmojiRepository.repository.findOne({
            where: {
              groupAchievement: {
                id: groupAchievement.id,
              },
              user: {
                id: user.id,
              },
              emoji: Emoji.LIKE,
            },
            relations: ['groupAchievement', 'user'],
          });

        // then
        expect(groupAchievementEmojiEntity).toBeNull();
        expect(groupAchievementEmojiFirstOn).toEqual(
          GroupAchievementEmojiResponse.of(Emoji.LIKE, true),
        );
        expect(groupAchievementEmojiFirstOff).toEqual(
          GroupAchievementEmojiResponse.of(Emoji.LIKE, false),
        );
        expect(groupAchievementEmojiSecondOn).toEqual(
          GroupAchievementEmojiResponse.of(Emoji.LIKE, true),
        );
        expect(groupAchievementEmojiSecondOff).toEqual(
          GroupAchievementEmojiResponse.of(Emoji.LIKE, false),
        );
      });
    });
  });
});
