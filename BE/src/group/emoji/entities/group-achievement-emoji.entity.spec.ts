import { UsersFixture } from '../../../../test/user/users-fixture';
import { GroupAchievementFixture } from '../../../../test/group/achievement/group-achievement-fixture';
import { GroupFixture } from '../../../../test/group/group/group-fixture';
import { GroupCategoryFixture } from '../../../../test/group/category/group-category-fixture';
import { GroupAchievementEmojiFixture } from '../../../../test/group/emoji/group-achievement-emoji-fixture';
import { Emoji } from '../domain/emoji';
import { GroupAchievementEmojiEntity } from './group-achievement-emoji.entity';
import { GroupAchievementEntity } from '../../achievement/entities/group-achievement.entity';
import { UserEntity } from '../../../users/entities/user.entity';

describe('GroupAchievementEmojiEntity Test', () => {
  describe('from을 이용해서 GroupAchievementEmojiEntity를 생성할 수 있다.', () => {
    it('from을 이용해서 GroupAchievementEmojiEntity를 생성할 수 있다.', () => {
      // given
      const user = UsersFixture.user('ABC');
      const group = GroupFixture.group('group');
      const groupCategory = GroupCategoryFixture.groupCategory(
        user,
        group,
        'groupCategory',
      );
      const groupAchievement = GroupAchievementFixture.groupAchievement(
        user,
        group,
        groupCategory,
        'groupAchievement',
      );

      const groupAchievementEmoji =
        GroupAchievementEmojiFixture.groupAchievementEmoji(
          user,
          groupAchievement,
          Emoji.SMILE,
        );

      // when
      const groupAchievementEmojiEntity = GroupAchievementEmojiEntity.from(
        groupAchievementEmoji,
      );

      // then
      expect(groupAchievementEmojiEntity.id).toBe(groupAchievementEmoji.id);
      expect(groupAchievementEmojiEntity.groupAchievement).toStrictEqual(
        GroupAchievementEntity.from(groupAchievementEmoji.groupAchievement),
      );
      expect(groupAchievementEmojiEntity.user).toStrictEqual(
        UserEntity.from(groupAchievementEmoji.user),
      );

      expect(groupAchievementEmojiEntity.emoji).toBe(
        groupAchievementEmoji.emoji,
      );
    });

    it('from을 이용해서 null 프로퍼티가 포함된 GroupAchievementEmojiEntity를 생성할 수 있다.', () => {
      // given

      const groupAchievementEmoji =
        GroupAchievementEmojiFixture.groupAchievementEmoji(
          null,
          null,
          Emoji.SMILE,
        );

      // when
      const groupAchievementEmojiEntity = GroupAchievementEmojiEntity.from(
        groupAchievementEmoji,
      );

      // then
      expect(groupAchievementEmojiEntity.id).toBe(groupAchievementEmoji.id);
      expect(groupAchievementEmojiEntity.groupAchievement).toBeNull();
      expect(groupAchievementEmojiEntity.user).toBeNull();

      expect(groupAchievementEmojiEntity.emoji).toBe(
        groupAchievementEmoji.emoji,
      );
    });

    it('from을 이용해서 undefined 프로퍼티가 포함된 GroupAchievementEmojiEntity를 생성할 수 있다.', () => {
      // given

      const groupAchievementEmoji =
        GroupAchievementEmojiFixture.groupAchievementEmoji(
          undefined,
          undefined,
          Emoji.SMILE,
        );

      // when
      const groupAchievementEmojiEntity = GroupAchievementEmojiEntity.from(
        groupAchievementEmoji,
      );

      // then
      expect(groupAchievementEmojiEntity.id).toBe(groupAchievementEmoji.id);
      expect(groupAchievementEmojiEntity.groupAchievement).toBeUndefined();
      expect(groupAchievementEmojiEntity.user).toBeUndefined();

      expect(groupAchievementEmojiEntity.emoji).toBe(
        groupAchievementEmoji.emoji,
      );
    });
  });

  describe('toModel을 이용해서 GroupAchievementEmoji를 생성할 수 있다.', () => {
    it('toModel을 이용해서 GroupAchievementEmoji를 생성할 수 있다.', () => {
      // given
      const user = UsersFixture.user('ABC');
      const userEntity = UserEntity.from(user);
      const group = GroupFixture.group('group');
      const groupCategory = GroupCategoryFixture.groupCategory(
        user,
        group,
        'groupCategory',
      );
      const groupAchievement = GroupAchievementFixture.groupAchievement(
        user,
        group,
        groupCategory,
        'groupAchievement',
      );

      const groupAchievementEntity =
        GroupAchievementEntity.from(groupAchievement);

      const groupAchievementEmoji =
        GroupAchievementEmojiFixture.groupAchievementEmoji(
          user,
          groupAchievement,
          Emoji.SMILE,
        );
      const groupAchievementEmojiEntity = GroupAchievementEmojiEntity.from(
        groupAchievementEmoji,
      );

      // when
      const groupAchievementEmojiModel = groupAchievementEmojiEntity.toModel();

      // then
      expect(groupAchievementEmojiModel.id).toBe(groupAchievementEmoji.id);
      expect(groupAchievementEmojiModel.groupAchievement).toEqual(
        groupAchievementEntity.toModel(),
      );
      expect(groupAchievementEmojiModel.user).toStrictEqual(
        userEntity.toModel(),
      );
      expect(groupAchievementEmojiModel.emoji).toBe(
        groupAchievementEmoji.emoji,
      );
    });

    it('toModel을 이용해서 null 프로퍼티가 있는 GroupAchievementEmoji를 생성할 수 있다.', () => {
      // given
      const groupAchievementEmoji =
        GroupAchievementEmojiFixture.groupAchievementEmoji(
          null,
          null,
          Emoji.SMILE,
        );
      const groupAchievementEmojiEntity = GroupAchievementEmojiEntity.from(
        groupAchievementEmoji,
      );

      // when
      const groupAchievementEmojiModel = groupAchievementEmojiEntity.toModel();

      // then
      expect(groupAchievementEmojiModel.id).toBe(groupAchievementEmoji.id);
      expect(groupAchievementEmojiModel.groupAchievement).toBeUndefined();
      expect(groupAchievementEmojiModel.user).toBeUndefined();
      expect(groupAchievementEmojiModel.emoji).toBe(
        groupAchievementEmoji.emoji,
      );
    });
  });
});
